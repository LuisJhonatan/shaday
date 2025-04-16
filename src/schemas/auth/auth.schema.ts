import zod from "zod";

export const AuthSchema = zod.object({
  email: zod.string().email("El correo electrónico no es válido"),
  password: zod
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula.")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula.")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número."),
});

export const ResetPasswordSchema = zod.object({
  email: zod.string().email("El correo electrónico no es válido"),
});

export const VerifyResetPasswordSchema = zod.object({
  password: zod
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula.")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula.")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número."),
  token: zod.string(),
});

export const ChangePasswordSchema = zod.object({
  old_password: zod.string(),
  new_password: zod
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula.")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula.")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número."),
});
