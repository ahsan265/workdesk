import { Card } from "../models/card";
import { MultiSelect } from "../models/multiSelect";
import { OneSelect } from "../models/oneSelect";
import { SearchInput } from "../models/searchInput";

const TicketsCard: Card = {
    icon: '../../assets/images/tickets/total_tickets.svg',
    title: 'Total Tickets',
    color: '#EDEDF6',
    mainResult: '12',
    secondResultText: '',
    secondResultNumber: 0,
    iconUp: '../../assets/images/cards/arrowUp.svg',
    iconDown: '../../assets/images/cards/arrowDown.svg'
};
const TicketsCard1: Card = {
    icon: '../../assets/images/tickets/total_assigned.svg',
    title: 'Total Assigned to you',
    color: '#E2F9F7',
    mainResult: '12',
    secondResultText: '',
    secondResultNumber: 0,
    iconUp: '../../assets/images/cards/arrowUp.svg',
    iconDown: '../../assets/images/cards/arrowDown.svg'
};
const oneSelectData2: OneSelect[] = [{ id: 1, name: 'Assignee', selected: true }, { id: 1, name: 'Chats', selected: false }];
const oneSelectData3: OneSelect[] = [{ id: 1, name: 'Status', selected: true }, { id: 1, name: 'Chats', selected: false }];
const priorityData: OneSelect[] = [
    { id: 0, name: 'All priority', selected: true }, { id: 1, name: 'Urgent', selected: false },
    { id: 2, name: 'High', selected: false },
    { id: 3, name: 'Normal', selected: false },
    { id: 4, name: 'Low', selected: false }];

const searchInputData: SearchInput = {
    placeholder: 'Search by user or ticket name',
    searchText: ''
};
const ticketsTableSetting: any =
    [
        {
            index: 0,
            header: 'TICKET id',
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
            header: 'Ticket Name',
            width: 12,
            isHeaderImage: true,
            showHeader: true,
            isDropdown: false,
            checkmark: true,
            isImageItem: false,
            isUserItem: false
        },
        {
            index: 2,
            header: 'User',
            width: 18,
            isHeaderImage: true,
            showHeader: true,
            isDropdown: false,
            checkmark: true,
            isImageItem: false,
            isUserItem: false
        },
        {
            index: 3,
            header: 'Priority',
            width: 12,
            isHeaderImage: true,
            showHeader: true,
            isDropdown: false,
            checkmark: true,
            isImageItem: false,
            isUserItem: false
        },
        {
            index: 3,
            header: 'Status',
            width: 12,
            isHeaderImage: true,
            showHeader: true,
            isDropdown: false,
            checkmark: true,
            isImageItem: false,
            isUserItem: false
        },
        {
            index: 4,
            header: 'Due Date',
            width: 12,
            isHeaderImage: true,
            showHeader: true,
            isDropdown: false,
            checkmark: true,
            isImageItem: false,
            isUserItem: false
        },
        {
            index: 4,
            header: 'Assign',
            width: 12,
            isHeaderImage: true,
            showHeader: true,
            isDropdown: false,
            checkmark: true,
            isImageItem: false,
            isUserItem: false
        }
    ];

const tableData: any = [{
    ticketPrefix: '#',
    tickerNumber: 1111,
    ticketName: "Frontend",
    userName: 'Ahsan Sheikh',
    priority: {
        flagIcon: '../../assets/images/tickets/flag_high.svg',
        type: 'High',
    },
    status: {
        color: '#FF155A',
        background: '#FBC8D9',
        type: 'Done'
    },
    dueDate: '20.01.2022',
    assignee: '../../assets/images/tickets/rem_assignee.svg'

},
{
    ticketPrefix: '#',
    tickerNumber: 11131,
    ticketName: "Backend",
    userName: 'Slavisa',
    priority: {
        flagIcon: '../../assets/images/tickets/flag_high.svg',
        type: 'Normal',
    },
    status: {
        color: '#FF155A',
        background: '#FBC8D9',
        type: 'Not started'
    },
    dueDate: '20.01.2022',
    assignee: '../../assets/images/tickets/rem_assignee.svg'

},]
const statusType: MultiSelect =
{
    showSearchBar: false,
    showSelectAll: false,
    title: 'Status',
    data: [{
        id: 0,
        name: 'Done',
        selected: false
    },
    {
        id: 1,
        name: 'In progress',
        selected: false
    },
    {
        id: 2,
        name: 'Not started',
        selected: false
    }]
}

export {
    TicketsCard, TicketsCard1, oneSelectData2, oneSelectData3, priorityData, searchInputData, ticketsTableSetting, tableData, statusType
}