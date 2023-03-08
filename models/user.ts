import { Media } from "./media"

export interface User {
    id: string,
    username: string,
    email: string,
    password: string,
    lists?: Media[]
}