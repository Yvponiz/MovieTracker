import { Media } from "./media"
export interface UserList {
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

