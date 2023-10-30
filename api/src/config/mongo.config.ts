import { registerAs } from "@nestjs/config"

export const mongoConfig = registerAs('mongodb', () => ({
    uri: process.env.MONGODB_URI,
  }))
