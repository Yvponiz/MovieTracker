import { Media } from "./media"

export interface User {
    username: string,
    email: string,
    password: string,
    lists?: Media[]
}