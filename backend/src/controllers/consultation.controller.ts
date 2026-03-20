import { getAuth } from "@clerk/express";
import { Consultation } from "../models/consultation.model.ts";

export const bookConsultation = async (req, res) => {
  const { userId } = getAuth(req);
  const consultation = await Consultation.create({
    patientId: userId,
    ...req.body,
  });
  res.json(consultation);
};

export const getMyConsultations = async (req, res) => {
  const { userId } = getAuth(req);
  const consultations = await Consultation.find({
    $or: [{ patientId: userId }, { practitionerId: userId }],
  });
  res.json(consultations);
};
