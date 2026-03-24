import { useAuth } from "@clerk/react";
import { useMemo } from "react";
import { commonApi } from "../api/common";
import { patientApi } from "../api/patient";
import { supplierApi } from "../api/supplier";
import { practitionerApi } from "../api/practitioner";
import { adminApi } from "../api/admin";
import { productApi } from "../api/product";
import { notificationApi } from "../api/notification";

export const useAppApi = () => {
  const { getToken } = useAuth();
  
  return useMemo(
    () => ({
      common: commonApi(getToken),
      patient: patientApi(getToken),
      supplier: supplierApi(getToken),
      practitioner: practitionerApi(getToken),
      admin: adminApi(getToken),
      product: productApi(getToken),
      notification: notificationApi(getToken),
    }),
    [getToken],
  );
};
