import { v4 as uuidv4 } from "uuid";
import { Consultation } from "../models/consultation.model";
import { createNotification } from "./notification.service";
import { io } from "../lib/socket";
import { User } from "../models/User.model";
import { clerkClient } from "@clerk/express";

export const CONSULTATION_DURATIONS = {
  chat: 30,  
  audio: 45,  
  video: 60   
};

const getConsultationEndTime = (c: any) => {
  if (c.sessionEndTime) return new Date(c.sessionEndTime);
  
  try {
    // Expected format: "09:00 AM-09:30 AM"
    const times = c.consultationTime.split("-");
    const endStr = (times[1] || times[0]).trim();
    const date = new Date(c.consultationDate);
    const [time, ampm] = endStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    
    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    
    date.setHours(hours, minutes, 0, 0);
    return date;
  } catch (e) {
    // Fallback: Use consultationDate + 2 hours grace
    return new Date(new Date(c.consultationDate).getTime() + 120 * 60 * 1000);
  }
};

export const createConsultationForPatient = async (patientId: string, data: any) => {
  // Check if patient already has a consultation on this date
  const startOfDay = new Date(data.consultationDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const existingConsultation = await Consultation.findOne({
    patientId,
    consultationDate: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
    status: "active"
  });

  if (existingConsultation) {
    throw new Error("You already have an active consultation on this date.");
  }

  const jitsiRoom =
    data.consultationType !== "chat"
      ? `mitihealth-${uuidv4().replace(/-/g, "")}`
      : null;

  const consultation = await Consultation.create({
    patientId,
    practitionerId: data.practitionerId,
    consultationDate: data.consultationDate,
    consultationTime: data.consultationTime,
    consultationType: data.consultationType,
    duration: CONSULTATION_DURATIONS[data.consultationType as keyof typeof CONSULTATION_DURATIONS],
    status: "active",
    jitsiRoom,
  });
  await createNotification({
    userId: data.practitionerId,
    type: "consultation:new",
    title: "New consultation booking",
    message: `You have a new ${data.consultationType} consultation booking.`,
    metadata: { consultationId: consultation._id },
    sendEmailAlert: true,
  });

  // Emit WebSocket event for real-time notification to practitioner
  const patient = await User.findOne({ 
    clerkId: patientId 
  });
  io.emit("consultation:new", {
    consultationId: consultation._id,
    practitionerId: data.practitionerId,
    patientId,
    consultationType: data.consultationType,
    consultationDate: data.consultationDate,
    consultationTime: data.consultationTime,
    patientName: patient?.name || "Patient",
  });

  return consultation;
};


export const getConsultationsForUser = async (userId: string) => {
  const consultations = await Consultation.find({
    $or: [{ patientId: userId }, { practitionerId: userId }],
  });

  const now = new Date();
  const validConsultations = [];

  for (const consultation of consultations) {
    const obj = consultation.toObject() as any;
    
    // Proactive Cleanup: Auto-complete if expired
    if (obj.status === "active") {
      const endTime = getConsultationEndTime(obj);
      if (now > endTime) {
        await Consultation.findByIdAndUpdate(obj._id, { status: "completed" });
        obj.status = "completed";
      }
    }
    validConsultations.push(obj);
  }

  const withProfilePic = await Promise.all(
    validConsultations.map(async (obj) => {

      try {
        const [patient, practitioner] = await Promise.all([
          obj.patientId
            ? clerkClient.users.getUser(obj.patientId)
            : null,
          obj.practitionerId
            ? clerkClient.users.getUser(obj.practitionerId)
            : null,
        ]);

        return {
          ...obj,
          patientProfile: patient
            ? {
                id: patient.id,
                fullName: `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.trim(),
                imageUrl: patient.imageUrl,
                email: patient.emailAddresses?.[0]?.emailAddress,
              }
            : null,
          practitionerProfile: practitioner
            ? {
                id: practitioner.id,
                fullName: `${practitioner.firstName ?? ""} ${practitioner.lastName ?? ""}`.trim(),
                imageUrl: practitioner.imageUrl,
                email: practitioner.emailAddresses?.[0]?.emailAddress,
              }
            : null,
        };
      } catch (e) {
        return {
          ...obj,
          patientProfile: null,
          practitionerProfile: null,
        };
      }
    })
  );

  return withProfilePic;
};

export const startConsultationSession = async (consultationId: string, userId: string) => {
  const consultation = await Consultation.findById(consultationId);
  
  if (!consultation) {
    throw new Error("Consultation not found");
  }
  
  if (consultation.status === "completed") {
    throw new Error("Consultation already completed");
  }
  
  const now = new Date();
  
  // If this is the first participant joining
  if (!consultation.firstParticipantJoined) {
    const sessionStartTime = now;
    const sessionEndTime = new Date(sessionStartTime.getTime() + consultation.duration * 60 * 1000);
    
    await Consultation.findByIdAndUpdate(consultationId, {
      status: "active",
      firstParticipantJoined: now,
      sessionStartTime,
      sessionEndTime,
    });
    
    // Create notification for the other participant
    const otherUserId = consultation.patientId === userId ? consultation.practitionerId : consultation.patientId;
    await createNotification({
      userId: otherUserId,
      type: "consultation:joined",
      title: "Session Started",
      message: "Your consultation session has started. You can now join.",
      metadata: { consultationId },
      sendEmailAlert: true,
    });
    
    // Emit WebSocket event for real-time updates
    io.emit("consultation:status", {
      consultationId,
      status: "active",
      sessionStartTime,
      sessionEndTime,
      userId
    });
    
    return { status: "started", sessionEndTime };
  }
  
  // If session is already active, just return current info
  const timeRemaining = consultation.sessionEndTime 
    ? Math.max(0, consultation.sessionEndTime.getTime() - now.getTime())
    : 0;
    
  return { 
    status: "already_active", 
    sessionEndTime: consultation.sessionEndTime || null,
    timeRemaining
  };
};

export const completeConsultationSession = async (consultationId: string, userId: string) => {
  const consultation = await Consultation.findById(consultationId);
  
  if (!consultation) {
    throw new Error("Consultation not found");
  }
  
  if (consultation.status === "completed") {
    return { status: "already_completed" };
  }
  
  await Consultation.findByIdAndUpdate(consultationId, {
    status: "completed",
    sessionEndTime: new Date(),
  });
  
  // Notify both participants
  const participants = [consultation.patientId, consultation.practitionerId];
  for (const participantId of participants) {
    if (participantId !== userId) {
      await createNotification({
        userId: participantId,
        type: "consultation:completed",
        title: "Session Completed",
        message: "Your consultation session has been completed.",
        metadata: { consultationId },
        sendEmailAlert: true,
      });
    }
  }
  
  // Emit WebSocket event for real-time updates
  io.emit("consultation:status", {
    consultationId,
    status: "completed",
    sessionEndTime: new Date(),
    userId
  });
  
  return { status: "completed" };
};

export const getConsultationStatus = async (consultationId: string) => {
  const consultation = await Consultation.findById(consultationId);
  
  if (!consultation) {
    throw new Error("Consultation not found");
  }
  
  const now = new Date();
  let timeRemaining = 0;
  
  if (consultation.status === "active" && consultation.sessionEndTime) {
    timeRemaining = Math.max(0, consultation.sessionEndTime.getTime() - now.getTime());
    
    // Auto-complete if time is up
    if (timeRemaining === 0) {
      await Consultation.findByIdAndUpdate(consultationId, {
        status: "completed",
      });
      consultation.status = "completed";
    }
  }
  
  return {
    status: consultation.status,
    duration: consultation.duration,
    consultationType: consultation.consultationType,
    sessionStartTime: consultation.sessionStartTime,
    sessionEndTime: consultation.sessionEndTime,
    timeRemaining,
    canJoin: consultation.status !== "completed" && (
      consultation.status === "active"
    )
  };
};

export const checkAndCreateConsultationThreads = async () => {
  // This function is now handled by the startConsultationSession function
  // Keeping for backward compatibility
  return true;
};

export const autoCompleteElapsedConsultations = async () => {
  const now = new Date();
  
  // Find consultations that are active
  const activeConsultations = await Consultation.find({
    status: "active",
  });

  if (activeConsultations.length === 0) return;

  for (const consultation of activeConsultations) {
    const endTime = getConsultationEndTime(consultation);
    
    if (now > endTime) {
      await Consultation.findByIdAndUpdate(consultation._id, {
        status: "completed",
      });

      // Notify both participants
      const participants = [consultation.patientId, consultation.practitionerId];
      for (const participantId of participants) {
        await createNotification({
          userId: participantId,
          type: "consultation:completed",
          title: "Session Completed",
          message: "Your consultation session has been automatically completed.",
          metadata: { consultationId: consultation._id },
          sendEmailAlert: false,
        });
        
        // Emit WebSocket event to specific user
        io.emit("consultation:status", {
          consultationId: consultation._id,
          status: "completed",
          sessionEndTime: consultation.sessionEndTime || endTime,
          userId: participantId
        });
      }
      
      console.log(`✅ Auto-completed elapsed consultation: ${consultation._id}`);
    }
  }
};

