const websites = [
  {
    text: 'Analytics',
    url: ['https://analytics.gconsole.io/'],
    image: '../assets/images/sidebar/analytics.svg'
  },
  {
    text: 'Console',
    url: ['https://gconsole.io/'],
    image: '../assets/images/sidebar/console.svg'
  }
];

const icons = {
  integrationIcon: '../assets/images/sidebar/integration.svg',
  dashboardIcon: '../assets/images/sidebar/dashboard.svg',
  activeDashboardIcon: '../assets/images/sidebar/dashboard_active.svg',
  callIcon: '../assets/images/sidebar/calls.svg',
  activeCallIcon: '../assets/images/sidebar/calls_active.svg',
  agentIcon: '../assets/images/sidebar/agents.svg',
  activeAgentIcon: '../assets/images/sidebar/agents_active.svg',
  logo: '../assets/images/sidebar/gigaaa_logo_1.svg',
  logoCollapsed: '../assets/images/sidebar/gigaaa_logo_2.svg'
};

const sidebarData: any = [
  {
    iconUrl: icons.integrationIcon,
    name: 'Select integration',
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
    name: 'Calls',
    routeUrl: ['calls'],
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
  }
];

export { websites, icons, sidebarData };
