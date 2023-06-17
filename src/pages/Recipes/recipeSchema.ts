import * as z from "zod";
import { Units } from "../../api";

const recipeSchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(3, {
      message: "El nombre de la formula debe tener al menos 3 caracteres",
    })
    .max(50, {
      message: "El nombre debe tener máximo 50 caracteres",
    }),
  productId: z.string({ required_error: "El producto es requerido" }).nonempty({
    message: "El producto es requerido",
  }),
  producedQuantity: z
    .number({
      invalid_type_error: "La cantidad debe ser un número",
      required_error: "La cantidad es requerido",
    })
    .positive({
      message: "La cantidad debe ser mayor a 0",
    }),
});

const ingredientsSchema = z.object({
  productId: z.string({ required_error: "El producto es requerido" }).nonempty({
    message: "El producto es requerido",
  }),
  quantity: z
    .number({
      invalid_type_error: "La cantidad debe ser un número",
      required_error: "La cantidad es requerido",
    })
    .positive({
      message: "La cantidad debe ser mayor a 0",
    }),
});

export interface RecipeIngredient {
  productId: string;
  productName: string;
  quantity: number;
  unit: Units;
  averageCost: number;
}

export { recipeSchema, ingredientsSchema };
