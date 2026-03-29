import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(4000),
    API_BASE_URL: z.string().url().default("http://localhost:4000"),
    API_PREFIX: z.string().default(""),
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    WEBHOOK_SECRET: z.string().min(1),
    OPENAI_API_KEY: z.string().optional(),
    ELEVENLABS_API_KEY: z.string().optional(),
    RUNWAY_API_KEY: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    AWS_REGION: z.string().optional(),
    S3_BUCKET: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    DEFAULT_STORAGE_PROVIDER: z.string().default("s3"),
    DEFAULT_LLM_PROVIDER: z.string().default("openai"),
    DEFAULT_TTS_PROVIDER: z.string().default("elevenlabs"),
    DEFAULT_RENDER_PROVIDER: z.string().default("remotion"),
    FREE_PLAN_VIDEO_LIMIT: z.coerce.number().default(3),
    PRO_PLAN_VIDEO_LIMIT: z.coerce.number().default(100)
});
export const env = envSchema.parse(process.env);
