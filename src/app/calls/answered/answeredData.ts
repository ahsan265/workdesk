const dataTableSettings: any[] = [
  {
    primaryKey: 'full_name',
    header: 'FULL NAME & ID',
    width: 15,
    isImage: false,
    name: true,
    isDropdown: false,
    expand: false,
    editIcon: true,
    checkmark: false,
    isImageItem: false,
    isUserItem: false
  },
  {
    primaryKey: 'language_id',
    header: 'USER INFO',
    width: 15,
    isImage: true,
    name: false,
    isDropdown: false,
    expand: false,
    editIcon: true,
    checkmark: false,
    isImageItem: false,
    isUserItem: false
  },
  {
    primaryKey: 'call_type',
    header: 'CALL TYPE',
    width: 15,
    isImage: false,
    name: false,
    isDropdown: false,
    expand: false,
    editIcon: true,
    checkmark: false,
    isImageItem: true,
    isUserItem: false
  },
  {
    primaryKey: 'called',
    header: 'Called at',
    width: 15,
    isImage: false,
    name: true,
    isDropdown: false,
    expand: false,
    editIcon: true,
    checkmark: false,
    isImageItem: false,
    isUserItem: false
  },
  {
    primaryKey: 'agent_name',
    header: 'Agent name',
    width: 15,
    isImage: false,
    name: false,
    isDropdown: false,
    expand: false,
    editIcon: true,
    checkmark: false,
    isImageItem: true,
    isUserItem: false
  }
];

const agents = [
  {
    id: "1",
    full_name: 'Srdjan Marinkovic',
    language_id: [56, 175],
    call_type: {
      text: 'video',
      image: '../../../assets/images/callInterface/video.svg'
    },
    called: '10:50',
    agent_name: {
      text: 'video',
      image: '../../../assets/images/callInterface/user.png'
    }
  },
  {
    id: "2",
    full_name: 'Marko Marinkovic',
    language_id: [56, 175],
    call_type: {
      text: 'video',
      image: '../../../assets/images/callInterface/video.svg'
    },
    called: '10:50',
    agent_name: {
      text: 'video',
      image: '../../../assets/images/callInterface/video.svg'
    }
  },
  {
    id: "3",
    full_name: 'Zoran Mihajilovic',
    language_id: [56, 175],
    call_type: {
      text: 'video',
      image: '../../../assets/images/callInterface/video.svg'
    },
    called: '10:50',
    agent_name: {
      text: 'video',
      image: '../../../assets/images/callInterface/video.svg'
    }
  },
  {
    id: "4",
    full_name: 'Test',
    language_id: [56, 175],
    call_type: {
      text: 'video',
      image: '../../../assets/images/callInterface/video.svg'
    },
    called: '10:50',
    agent_name: {
      text: 'video',
      image: '../../../assets/images/callInterface/video.svg'
    }
  }
];

export { dataTableSettings, agents };
