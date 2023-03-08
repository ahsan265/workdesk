import { FreeSeats } from "src/app/models/agentSocketModel";

const agentLoggedData: any = {
  active: true,
  display_name: 'string',
  email: 'string',
  first_name: 'string',
  images: {
    96: '',
    128: '',
    original: ''
  },
  inactive: true,
  invited: true,
  is_available: true,
  is_in_call: true,
  is_in_chat: true,
  is_online: true,
  is_organization_admin: true,
  joined: true,
  languages: [
    {
      id: 6,
      name: '',
      code: ''
    }
  ],
  last_name: 'string',
  num_chats: 0,
  phone_number: 'string',
  role: 'string',
  uuid: 'string'
};
const freeSeats: FreeSeats = {
  count: 0,
  free_seats: false,
  type: 'free_seats'
}
export { agentLoggedData ,freeSeats};
