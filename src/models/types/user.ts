import { Document } from 'mongoose'

export default interface IUser extends Document {
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    role: String,
    active?: Boolean,
    createdAt?: Date,
    updatedAt?: Date
}
