import { IBase } from "./base";

export interface IUser extends IBase {
    username: string;
    fullName: string;
    password: string;
    email: string;
    profilePicture: File;
    subscribers: string[];
    sessionToken: string;
}