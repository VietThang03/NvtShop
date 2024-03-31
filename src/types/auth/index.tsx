import { string } from "yup";

export type LoginAuth = {
    email: string
    password: string
}

export type RegisterAuth = {
    email: string
    password: string
}

export type UpdateAuth = {
    email: string
    role: string
    address?: string
    city?: string
    phoneNumber?: string
    firstName: string
    lastName: string
    middleName: string
    avatar?: string
}

export type ChangePassword = {
    currentPassword: string
    newPassword: string
}