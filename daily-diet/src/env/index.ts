import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test", override: true });
} else {
  config();
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(["sqlite3"]),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
  BCRYPT_SALT: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
