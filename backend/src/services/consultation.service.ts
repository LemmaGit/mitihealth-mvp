import { v4 as uuidv4 } from "uuid";
import { Consultation } from "../models/consultation.model.ts";
import { createNotification } from "./notification.service.ts";

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
  return consultation;
};

export const getConsultationsForUser = async (userId: string) => {
  return Consultation.find({
    $or: [{ patientId: userId }, { practitionerId: userId }],
  });
};

