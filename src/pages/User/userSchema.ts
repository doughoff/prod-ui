import * as z from "zod";

const userSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
    })
    .min(3, {
      message: "El nombre debe tener al menos 3 caracteres",
    })
    .max(50, {
      message: "El nombre debe tener máximo 50 caracteres",
    })
    .refine(
      (val) => {
        return val.length <= 255;
      },
      {
        message: "String can't be more than 255 characters",
      }
    ),
  email: z
    .string({
      required_error: "El email es requerido",
    })
    .email({
      message: "Email no válido",
    }),
  password: z
    .string({
      required_error: "La contraseña es requerida",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    })
    .max(50, {
      message: "La contraseña debe tener máximo 50 caracteres",
    }),
  passwordConfirmation: z
    .string({
      required_error: "La confirmación de contraseña es requerida",
    })
    .min(6, {
      message: "La confirmación de contraseña debe tener al menos 6 caracteres",
    })
    .max(50, {
      message: "La confirmación de contraseña debe tener máximo 50 caracteres",
    }),
  roles: z
    .array(
      z.enum(["ADMIN", "OPERATOR"], {
        required_error: "El rol es requerido",
        invalid_type_error:
          "El rol es inválido, debe ser Administrador u Operador",
      })
    )
    .min(1, {
      message: "Debe seleccionar al menos un rol",
    }),
});

export { userSchema };
