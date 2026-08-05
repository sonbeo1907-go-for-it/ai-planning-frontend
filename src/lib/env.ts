import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1).default("AI Planning"),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().trim().min(1).optional(),
});

const parsedEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
});

if (!parsedEnv.success) {
  throw new Error(
    "Biến môi trường frontend không hợp lệ. Hãy sao chép .env.example thành .env.local.",
  );
}

export const env = {
  apiUrl: parsedEnv.data.NEXT_PUBLIC_API_URL.replace(/\/+$/, ""),
  appName: parsedEnv.data.NEXT_PUBLIC_APP_NAME,
  googleClientId: parsedEnv.data.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
} as const;
