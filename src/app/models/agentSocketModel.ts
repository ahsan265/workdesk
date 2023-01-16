import { ImagesModel } from './imagesModel';

export interface AgentList {
  all_call_requests: boolean;
  active: boolean;
  display_name: string;
  email: string;
  first_name: string;
  images: ImagesModel;
  inactive: boolean;
  invited: boolean;
  is_available: boolean;
  is_in_call: boolean;
  is_in_chat: boolean;
  is_online: boolean;
  is_organization_admin: boolean;
  is_organization_owner: boolean;
  is_image_set:boolean;
  joined: boolean;
  languages: AgentLanguages[];
  last_name: string;
  num_chats: number;
  phone_number: string;
  role: string;
  uuid: string;
  show_edit:boolean;
}

export interface AgentLanguages {
  id: number;
  name: string;
  code: string;
}
export interface AgentParameter {
  active?: number;
  invited?: number;
  languages?: number[];
}
export interface AgentAction {
  action: string;
  data: AgentParameter;
}
export interface AgentOnlineStatus {
  action: string;
  value: boolean;
}
export interface AgentOnlineOrNot {
  action: string;
  data: AgentOnlineStatus;
}
