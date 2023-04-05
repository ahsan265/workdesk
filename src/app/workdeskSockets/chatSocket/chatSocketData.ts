import { chatSendMessageModel, chatThreadModel, getMessageDataModel, hasTyping, typingChatModel } from "src/app/models/chatModel"

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
const defaultTypingData: hasTyping = {
    isTyping: false,
    data: {
        conversation_uuid: '',
    }
}
export {
    chatThreadDummyData,
    defaultSelectChatData,
    defaultSendChatData,
    defaultTypingData
}