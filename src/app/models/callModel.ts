export interface tableSettings {
  tableName: string;
  tableHeaders: tableHeading[];
}
export interface tableHeading {
  index: number;
  header: string;
  width: number;
  isHeaderImage: boolean;
  showHeader: true;
  isDropdown: false;
  checkmark: true;
  isImageItem: false;
  isUserItem: false;
}

export interface IncomingCallModel {
  browser: string;
  call_uuid: string;
  desktop: boolean;
  device: string;
  is_video: boolean;
  language_icon: string;
  language_id: number;
  mobile: false;
  name: string;
  operating_system: string;
  tablet: false;
  user_id: string;
  waiting_started_at: string;
}

export interface OngoingCallModel {
  agent_joined: boolean;
  browser: string;
  call_started_at: string;
  call_uuid: string;
  desktop: boolean;
  device: string;
  is_video: boolean;
  language_icon: string;
  language_id: number;
  mobile: boolean;
  name: string;
  operating_system: string;
  tablet: boolean;
  user_id: string;
  user_joined: boolean;
  wait_time: number;
  waiting_started_at: string;
}

export interface MissedCallModel {
  browser: string;
  call_uuid: string;
  desktop: boolean;
  device: string;
  is_video: boolean;
  language_icon: string;
  language_id: number;
  missed_at: string;
  mobile: boolean;
  name: string;
  operating_system: string;
  reason: string;
  tablet: boolean;
  user_id: string;
  wait_time: number;
  waiting_started_at: string;
}

export interface AnsweredCallModel {
  agent_joined: boolean;
  browser: string;
  call_ended_at: string;
  call_started_at: string;
  call_time: number;
  call_uuid: string;
  desktop: boolean;
  device: string;
  is_video: boolean;
  language_icon: string;
  language_id: number;
  mobile: boolean;
  name: string;
  operating_system: string;
  tablet: boolean;
  user_id: string;
  user_joined: boolean;
  wait_time: number;
  waiting_started_at: string;
}

export interface CallsModel {
  incoming: IncomingCallModel[];
  missed: MissedCallModel[];
  finished: AnsweredCallModel[];
  ongoing: OngoingCallModel[];
  new_call: boolean;
}

/// for Tables Data Model
export interface IncomingCallModelTable {
  hashIcon: string;
  call_uuid: string;
  language_icon: string;
  utilites: UtlitiesIcon[];
  callType: ImageText;
  name: string;
  user_id: string;
  time: string;
  userImage: string;
  showUserImage: boolean;
  callPickButton: string;
  showCallButton: boolean;
}

export interface OngoingCallModelTable {
  user_details: ImageText;
  utilites: UtlitiesIcon[];
  callType: ImageText;
  call_uuid: string;
  duration: string;
  agent_name: string;
  user_id: string;
  agent_details: ImageText;
}

export interface MissedCallModelTable {
  user_details: ImageText;
  utilites: UtlitiesIcon[];
  callType: ImageText;
  call_uuid: string;
  wait_time: string;
  called_at: string;
  agent_name: string;
  user_id: string;
  resaon: string;
}

export interface AnsweredCallModelTable {
  user_details: ImageText;
  utilites: UtlitiesIcon[];
  callType: ImageText;
  call_uuid: string;
  duration: string;
  agent_name: string;
  user_id: string;
  agent_details: ImageText;
}

export interface AgentModelTable {
  uuid: string;
  agent_details: ImageText;
  email: string;
  is_online_icon_color: string;
  is_logged_in: boolean;
  activity_icon: string;
  agent_name: String;
  utilites: UtlitiesIcon[];
  role: string;
  can_edit: boolean;
  show_edit: boolean;
  invitation_accepted: boolean;
  loggedIn_user_icon: string;
  edit_icon: string;
  routeUrl: string[];
  organization_admin_icon: String;
  is_organization_admin: boolean;
}

export interface UtlitiesIcon {
  image: string;
}
export interface ImageText {
  text: string;
  image: string;
}
