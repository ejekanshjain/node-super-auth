import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 5000,
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017',
    JWT_SECRET: process.env.JWT_SECRET || 'secret'
}

export const { NODE_ENV, PORT, MONGODB_URL, JWT_SECRET } = config
