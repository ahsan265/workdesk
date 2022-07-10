const dataTableSettings: any[] = [
  {
    primaryKey: 'agent',
    header: 'AGENT',
    width: 25,
    isImage: false,
    name: false,
    isDropdown: false,
    expand: false
  },
  {
    primaryKey: 'name',
    header: 'FULL NAME',
    width: 25,
    isImage: false,
    name: true,
    isDropdown: false,
    expand: false
  },
  {
    primaryKey: 'language_id',
    header: 'LANGUAGE',
    width: 25,
    isImage: true,
    name: false,
    isDropdown: false,
    expand: false
  },
  {
    primaryKey: 'role',
    header: 'ROLE',
    width: 25,
    isImage: false,
    name: false,
    isDropdown: false,
    expand: false
  }
];

const agents = [
  {
    id: 1,
    agent: 'srdjanmarinkovic31@gmail.com',
    name: 'Srdjan Marinkovic',
    role: 'Admin',
    routeUrl: ['agents', 'settings', 1],
    checked: false,
    isDropdown: false,
    language_id: [56, 175]
  },
  {
    id: 2,
    agent: 'nikola@gmail.com',
    name: 'Nikola Narancic',
    role: 'Admin',
    routeUrl: ['agents', 'settings', 2],
    checked: false,
    isDropdown: false,
    language_id: [56]
  },
  {
    id: 3,
    agent: 'alex@gmail.com',
    name: 'Alex Stefanovic',
    role: 'Admin',
    routeUrl: ['agents', 'settings', 3],
    checked: false,
    isDropdown: false,
    language_id: [56, 83]
  },
  {
    id: 4,
    agent: 'muhamed@gmail.com',
    name: 'Muhamed Ahsan',
    role: 'Admin',
    routeUrl: ['agents', 'settings', 4],
    checked: false,
    isDropdown: false,
    language_id: [56, 175]
  }
];

export { dataTableSettings, agents };
