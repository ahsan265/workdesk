import { tableSettings } from 'src/app/models/callModel';

const incomingTableSetting: tableSettings = {
  tableName: 'incoming',
  tableHeaders: [
    {
      index: 0,
      header: 'Queue',
      width: 10,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 1,
      header: 'User',
      width: 20,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 2,
      header: 'User id',
      width: 20,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 3,
      header: 'User Info',
      width: 20,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 4,
      header: 'Call Type',
      width: 10,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    },
    {
      index: 4,
      header: 'Wait Time',
      width: 20,
      isHeaderImage: true,
      showHeader: true,
      isDropdown: false,
      checkmark: true,
      isImageItem: false,
      isUserItem: false
    }
  ]
};
export { incomingTableSetting };
