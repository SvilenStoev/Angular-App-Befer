import { IBase } from "./base";

export interface IPost extends IBase {
    afterImgUrl: string;
    beforeImgUrl: string;
    description: string;
    title: string;
    owner: {
        __type: string;
        className: string,
        objectId: string;
    },
    isPublic: boolean;
}