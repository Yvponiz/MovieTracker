import { Media } from "./media"
export interface UserList {
    id: string;
    name: string;
    items: Media[];
}
export interface User {
    id?: string;
    username: string;
    email: string;
    password: string;
    lists?: UserList[];
}

