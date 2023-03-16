import { SearchInput } from "src/app/models/searchInput";
import { assignedAgent, unAssignedAgent } from "src/app/models/tickets";

const searchInputData: SearchInput = {
    placeholder: 'Search by agent’s full name',
    searchText: ''
};

const assignedAgentData: assignedAgent[] = [{
    firstName: 'Ahsan',
    lastName: 'Sheikh',
    icon: '../../../assets/images/assignAgent/unassign_icon.svg',
    image: '../../../assets/images/tickets/default_agent.svg',
    nameIntials: 'AS'
},
{
    firstName: 'Alex',
    lastName: '007',
    icon: '../../../assets/images/assignAgent/unassign_icon.svg',
    image: '',
    nameIntials: 'A0'
}]
const unAssignedAgentData: unAssignedAgent[] = [{
    firstName: 'Ahsan',
    lastName: 'Sheikh',
    icon: '../../../assets/images/assignAgent/assign_icon.svg',
    image: '../../../assets/images/tickets/default_agent.svg',
    assignText: 'Assign',
    nameIntials: 'AS'
},
{
    firstName: 'Alex',
    lastName: '007',
    icon: '../../../assets/images/assignAgent/assign_icon.svg',
    image: '',
    nameIntials: 'A0',
    assignText: 'Assign',
}]
export {
    searchInputData, assignedAgentData, unAssignedAgentData
}