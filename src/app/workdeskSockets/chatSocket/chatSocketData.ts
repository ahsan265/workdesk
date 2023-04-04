import { chatSendMessageModel, chatThreadModel, getMessageDataModel } from "src/app/models/chatModel"

const chatThreadDummyData: chatThreadModel = {
    type: 'threads',
    selected_thread: 'dhgajhsdghjasgdajhsg', data: []
}
const defaultSelectChatData: getMessageDataModel = {
    data: [],
    type: 'selected_thread',
    selected_thread: ''
}
const defaultSendChatData: chatSendMessageModel = {
    action: 'message',
    data: {
        conversation_uuid: '',
        message: '',
        type: 'text'
    }
}
export {
    chatThreadDummyData,
    defaultSelectChatData,
    defaultSendChatData
}