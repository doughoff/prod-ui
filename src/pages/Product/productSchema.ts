import * as z from "zod";

const productSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre debe tener máximo 50 caracteres" }),
  description: z
    .string()
    .max(200, { message: "La descripción debe tener máximo 200 caracteres" })
    .optional(),
  barcode: z
    .string({ required_error: "El código de barras es requerido" })
    .min(3, { message: "El código de barras debe tener al menos 3 caracteres" })
    .regex(/^\d+$/, {
      message: "El código de barras debe contener solo números",
    }),
  unit: z.enum(["KG", "UNIT", "L", "OTHER"], {
    required_error:
      "La unidad de medida debe ser unidad, litro, kilogramo u otro",
  }),
  conversionFactor: z
    .number({
      required_error: "El factor de conversión es requerido",
    })
    .min(0.001, { message: "El factor de conversión debe ser mayor a 0" })
    .default(1),
  hasBatch: z.boolean({
    required_error: "Debe indicar si el producto tiene lote",
  }),
});

export { productSchema };
