import { IBase } from "./base";

export interface IComment extends IBase {
    content: string;
    author: {
        __type: "Pointer";
        className: "_User",
        objectId: string
    },
    publication: {
        __type: "Pointer"
        className: "Publication",
        objectId: string;
    },
}