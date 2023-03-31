import { chatSendMessageModel, chatThreadModel, getMessageDataModel } from "src/app/models/chatModel"

const chatThreadDummyData: chatThreadModel = {
    type: 'threads',
    selected_thread: 'dhgajhsdghjasgdajhsg', data: [{
        date_time: '20-03-2023',
        images: undefined,
        last_message: 'hello',
        unread_messages_count: 0,
        username: 'anon',
        uuid: 'jsdkhfs78',
        is_agent_message: false
    }]
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