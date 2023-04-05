import { chatThreadModelData } from "src/app/models/chatModel";

const chatThreadData: chatThreadModelData[] = [
]
const selectedThreadData: chatThreadModelData = {
    counter: 0,
    date: "2023-04-05T13:16:54Z",
    image: "https://data.gigaaa.link/customer_support/images/human_agents/default/original.png",
    isTyping: false,
    is_agent_message: false,
    last_message: '',
    name: "Anonymous",
    uuid: "44d468f3-28f5-4b57-b34e-fee81d6f99a1"
}

export {
    chatThreadData,
    selectedThreadData
}