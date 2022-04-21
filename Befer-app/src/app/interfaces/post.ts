import { IBase } from "./base";

export interface IPost extends IBase {
    afterImgUrl: string;
    beforeImgUrl: string;
    description: string;
    title: string;
    owner: {
        __type: string;
        className: string;
        objectId: string;
        createdAt: string;
        fullName: string;
        updatedAt: string;
        username: string;
        email: string;
    },
    isPublic: boolean;
    likes: string[];
}