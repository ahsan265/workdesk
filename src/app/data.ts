import { FreeSeats } from "./models/agentSocketModel";
import { CallsModel } from "./models/callModel";

const websites = [
  {
    text: 'Neo Console',
    url: ['https://gconsole.io/'],
    image: '../assets/images/sidebar/console_logo.svg'
  }
];

const addons = [
  {
    text: 'Analytics',
    url: ['https://analytics.gconsole.io/'],
    image: '../assets/images/sidebar/analytics.svg'
  },

];
const placeholder = {
  items_count: 10,
  items_per_page: 10,
  page_number: 1,
  total_pages: 10,
  type: '',
  calls: []
}

const placeholderIncoming = {
  new_call: false,
  type: 'incoming',
  calls: []
}
const defaultCallData: CallsModel = {
  incoming: placeholderIncoming,
  missed: placeholder,
  finished: placeholder,
  ongoing: placeholder,
  new_call: false
}
const icons = {
  integrationIcon: '../assets/images/sidebar/integration.svg',
  dashboardIcon: '../assets/images/sidebar/dashboard.svg',
  activeDashboardIcon: '../assets/images/sidebar/dashboard_active.svg',
  callIcon: '../assets/images/sidebar/calls.svg',
  activeCallIcon: '../assets/images/sidebar/calls_active.svg',
  agentIcon: '../assets/images/sidebar/agents.svg',
  activeAgentIcon: '../assets/images/sidebar/agents_active.svg',
  chatIcon: '../assets/images/sidebar/chat.svg',
  activeChatIcon: '../assets/images/sidebar/chat_clicked.svg',
  ticketIcon: '../assets/images/tickets/ticket_not_selected.svg',
  activeticketIcon: '../assets/images/tickets/ticket_selected.svg',
  logo: '../assets/images/sidebar/workdesk_logo_long.png',
  logoCollapsed: '../assets/images/sidebar/workdesk_logo_short.png'
};


const sidebarData: any = [
  {
    iconUrl: icons.integrationIcon,
    name: 'Select project',
    dropdownItems: [],
    dropdown: true,
    isLink: false
  },
  {
    iconUrl: icons.dashboardIcon,
    activeIconUrl: icons.activeDashboardIcon,
    name: 'Dashboard',
    routeUrl: ['dashboard'],
    dropdown: false,
    isLink: true
  },
  {
    iconUrl: icons.callIcon,
    activeIconUrl: icons.activeCallIcon,
    name: 'Requests',
    routeUrl: ['requests'],
    dropdown: false,
    isLink: true
  },
  {
    iconUrl: icons.agentIcon,
    activeIconUrl: icons.activeAgentIcon,
    name: 'Agents',
    routeUrl: ['agents'],
    dropdown: false,
    isLink: true
  },
  {
    iconUrl: icons.ticketIcon,
    activeIconUrl: icons.activeticketIcon,
    name: 'Tickets',
    routeUrl: ['tickets'],
    dropdown: false,
    isLink: true
  },
  {
    iconUrl: icons.chatIcon,
    activeIconUrl: icons.activeChatIcon,
    name: 'Chats',
    routeUrl: ['chat'],
    dropdown: false,
    isLink: true
  }
];

const sidebarDataAgent: any = [
  {
    iconUrl: icons.integrationIcon,
    name: 'Select project',
    dropdownItems: [],
    dropdown: true,
    isLink: false
  },

  {
    iconUrl: icons.callIcon,
    activeIconUrl: icons.activeCallIcon,
    name: 'Requests',
    routeUrl: ['requests'],
    dropdown: false,
    isLink: true
  },
  {
    iconUrl: icons.agentIcon,
    activeIconUrl: icons.activeAgentIcon,
    name: 'Agents',
    routeUrl: ['agents'],
    dropdown: false,
    isLink: true
  },
  {
    iconUrl: icons.ticketIcon,
    activeIconUrl: icons.activeticketIcon,
    name: 'Tickets',
    routeUrl: ['tickets'],
    dropdown: false,
    isLink: true
  },
  {
    iconUrl: icons.chatIcon,
    activeIconUrl: icons.activeChatIcon,
    name: 'Chats',
    routeUrl: ['chat'],
    dropdown: false,
    isLink: true
  }
];
export { websites, icons, sidebarData, addons, defaultCallData, sidebarDataAgent };
