import { Document } from 'mongoose'

export default interface IRefreshToken extends Document {
    userId: String,
    refreshToken: String,
    userAgent: String,
    type?: String,
    browser?: String,
    engine?: String,
    version?: String,
    os?: String
    createdAt?: Date,
    updatedAt?: Date
}
