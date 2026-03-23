import { useAuth } from "@clerk/react";
import { commonApi } from "../api/common";
import { patientApi } from "../api/patient";
import { supplierApi } from "../api/supplier";
import { practitionerApi } from "../api/practitioner";
import { adminApi } from "../api/admin";

export const useAppApi = () => {
  const { getToken } = useAuth();
  
  return {
    common: commonApi(getToken),
    patient: patientApi(getToken),
    supplier: supplierApi(getToken),
    practitioner: practitionerApi(getToken),
    admin: adminApi(getToken),
  };
};
