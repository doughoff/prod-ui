import dayjs from "dayjs";
import * as z from "zod";

export const customDate = z
  .string()
  .refine((v) => dayjs(v).isValid(), {
    message: "La fecha no es válida",
  })
  .refine(
    (val) => {
      if (dayjs(val).isBefore(dayjs())) {
        return true;
      }
      return false;
    },
    {
      message: "La fecha no puede ser mayor a la fecha actual",
    }
  );
