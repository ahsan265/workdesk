import { ImagesModel } from "./imagesModel";

export interface chatThreadModelData {
    image?: string;
    name: string;
    date: string;
    last_message: string;
    counter: number;
}

export interface chatThreadModel {
    date_time: string
    images?:ImagesModel
    last_message:string;
    unread_messages_count:number;
    username:string;
    uuid:string;
}