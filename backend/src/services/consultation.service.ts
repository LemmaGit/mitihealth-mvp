import { v4 as uuidv4 } from "uuid";
import { Consultation } from "../models/consultation.model.ts";

export const createConsultationForPatient = async (patientId: string, data: any) => {
  const jitsiRoom =
    data.consultationType !== "chat"
      ? `mitihealth-${uuidv4().replace(/-/g, "")}`
      : null;

  return Consultation.create({
    patientId,
    practitionerId: data.practitionerId,
    consultationDate: data.consultationDate,
    consultationTime: data.consultationTime,
    consultationType: data.consultationType,
    status: "booked",
    jitsiRoom,
  });
};

export const getConsultationsForUser = async (userId: string) => {
  return Consultation.find({
    $or: [{ patientId: userId }, { practitionerId: userId }],
  });
};

