import { IBase } from "./base";

export interface IComment {
    content: string;
    author?: {
        __type: "Pointer";
        className: "_User",
        objectId: string,
        fullName: string,
        username: string,
        email: string
    },
    publication?: {
        __type: "Pointer"
        className: "Publication",
        objectId: string;
    },
    objectId?: string;
    createdAt?: string;
    updatedAt?: string;
}