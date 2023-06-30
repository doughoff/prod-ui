import * as z from "zod";
import { customDate } from "../../utils/zodCustomTypes";
import { Unit } from "../../api";

const saleSchema = z.object({
  date: customDate,
  supplierId: z.string().nonempty({
    message: "El proveedor es requerido",
  }),
  documentNumber: z.string().optional(),
});

const saleItemSchema = z.object({
  productId: z.string().nonempty({
    message: "El producto es requerido",
  }),
  quantity: z
    .number({
      invalid_type_error: "El precio unitario debe ser un número",
      required_error: "La cantidad es requerida",
    })
    .positive({
      message: "La cantidad debe ser mayor a 0",
    }),
  price: z
    .number({
      invalid_type_error: "El precio unitario debe ser un número",
      required_error: "El precio unitario es requerido",
    })
    .positive({
      message: "El precio unitario debe ser mayor a 0",
    }),
  batch: z.string().optional(),
});

export interface SaleItems {
  productId: string;
  productName: string;
  quantity: number;
  total: number;
  batch?: string;
  price: number;
  unit: Unit;
}

export { saleSchema, saleItemSchema };
