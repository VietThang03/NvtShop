import { string } from "yup";

export type LoginAuth = {
    email: string
    password: string
}

export type RegisterAuth = {
    email: string
    password: string
}