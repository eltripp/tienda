import { z } from "zod";

const serverSchema = z
  .object({
    DATABASE_URL: z.string().min(1),
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    EMAIL_SERVER_HOST: z.string().optional(),
    EMAIL_SERVER_PORT: z
      .union([z.string(), z.number()])
      .transform((value) => Number(value))
      .optional(),
    EMAIL_SERVER_USER: z.string().optional(),
    EMAIL_SERVER_PASSWORD: z.string().optional(),
    EMAIL_FROM: z.string().email().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    ENCRYPTION_SECRET: z
      .string()
      .optional()
      .refine((value) => !value || value.length === 32, {
        message: "ENCRYPTION_SECRET debe tener 32 caracteres",
      }),
  })
  .superRefine((values, ctx) => {
    if ((values.GOOGLE_CLIENT_ID && !values.GOOGLE_CLIENT_SECRET) || (!values.GOOGLE_CLIENT_ID && values.GOOGLE_CLIENT_SECRET)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las variables de Google OAuth deben declararse juntas",
        path: ["GOOGLE_CLIENT_ID"],
      });
    }
    if ((values.EMAIL_SERVER_HOST || values.EMAIL_SERVER_USER || values.EMAIL_SERVER_PASSWORD) && !values.EMAIL_FROM) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "EMAIL_FROM es requerido cuando se configura un servidor SMTP",
        path: ["EMAIL_FROM"],
      });
    }
  });

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Error al validar variables de entorno", parsed.error.flatten().fieldErrors);
  throw new Error("Variables de entorno inválidas. Revisa la configuración en .env");
}

export const env = parsed.data;
