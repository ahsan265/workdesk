import { chatSendMessageModel, chatThreadModel, chatThreadModelData, getMessageDataModel, hasTyping, typingChatModel } from "src/app/models/chatModel"

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

const selectedThreadData: chatThreadModelData = {
    counter: 0,
    date: "2023-04-05T13:16:54Z",
    image: "https://data.gigaaa.link/customer_support/images/human_agents/default/original.png",
    isTyping: false,
    is_agent_message: false,
    last_message: '',
    name: "Anonymous",
    uuid: ""
}

export {
    chatThreadDummyData,
    defaultSelectChatData,
    defaultSendChatData,
    defaultTypingData,
    selectedThreadData
}