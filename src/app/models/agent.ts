export interface Agent {
  id: number;
  agent: string;
  name: string;
  role: string;
  routeUrl: any[];
  checked: boolean;
  isDropdown: boolean;
  language_id: number[];
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

export interface TableSettingsModel {
  index: number;
  header: string;
  width: number;
  defaultValue: string;
  showEditField: boolean;
  canEdit: boolean;
}

export interface UtlitiesIcon {
  image: string;
  is_disabled: boolean;
}
export interface ImageText {
  text: string;
  image: string;
}
export interface AgentCardInformation {
  text: string;
  image: string;
  color: string;
}

export interface InviteAgentModel {
  email: string;
  role: string;
  language_ids: number[];
}

export interface InvitedAgentTableLanguage {
  id: number;
  image: string;
}
export interface InvitedAgentsModel {
  email: string;
  languages: number;
}

export interface agentInvitationList {
  email: string;
  language: number[];
}
export interface tableSettingsDataModel {
  customization_id: number;
  customization_value: string;
  table_identifier: string;
}
