import { ImagesModel } from "./imagesModel";

export interface chatThreadModelData {
    image?: string;
    name: string;
    date: string;
    last_message: string;
    counter: number;
    uuid: string;
}

export interface chatThreadModel {
    selected_thread: string;
    type: string;
    data: chatThread[];

}
export interface chatThread {
    date_time: string
    images?: ImagesModel
    last_message: string;
    unread_messages_count: number;
    username: string;
    uuid: string;
    is_agent_message: boolean;
}
export interface chatSendMessageModel {
    action: string;
    data: messageInterface;
}
export interface messageInterface {
    conversation_uuid: string;
    message: string;
    type: string;
}

export interface getMessageDataModel {
    type: string;
    data: receivedMessage[];
    selected_thread: string;
}
export interface receivedMessage {
    id: number;
    message: string;
    uuid: string;
    type: string;
    images: ImagesModel;
    is_agent: boolean;
    date_time: string;
}
export interface selectedThreadModel {
    action: string;
    data: string;
}


