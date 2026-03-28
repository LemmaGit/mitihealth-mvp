import { v4 as uuidv4 } from "uuid";
import { Consultation } from "../models/consultation.model.ts";
import { Message } from "../models/message.model.ts";
import { createNotification } from "./notification.service.ts";
import { io } from "../lib/socket.ts";
import { User } from "../models/user.model.ts";

export const CONSULTATION_DURATIONS = {
  chat: 30,   // 450 ETB
  audio: 45,  // 850 ETB
  video: 60   // 1200 ETB
};

export const createConsultationForPatient = async (patientId: string, data: any) => {
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
    status: "booked",
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
  return Consultation.find({
    $or: [{ patientId: userId }, { practitionerId: userId }],
  });
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
      consultation.status === "active" || 
      (consultation.status === "booked" && new Date() >= new Date(consultation.consultationDate))
    )
  };
};

export const checkAndCreateConsultationThreads = async () => {
  // This function is now handled by the startConsultationSession function
  // Keeping for backward compatibility
  return true;
};

