import * as z from "zod";

const supplierSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre debe tener máximo 50 caracteres" }),
  RUC: z
    .string()
    .regex(/^[\d.-\s]*$/, { message: "El RUC solo puede contener números" })
    .optional(),
  CI: z
    .string()
    .regex(/^[\d.-\s]*$/, {
      message: "El Nro. de CI solo puede contener números",
    })
    .optional(),
});

export { supplierSchema };
