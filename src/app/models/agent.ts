
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
export interface AgentTableModel {
  id: string;
  agent: string;
  name: string;
  role: string;
  routeUrl: [string, string, string];
  checked: boolean;
  isDropdown: boolean;
  language_id: number[];
  editIcon: boolean;
  canEdit: boolean;
  invitation_accepted: boolean;
  checkmark: boolean;
  userItem: AgentCardInformation;
}

export interface AgentCardInformation {
  text: string;
  image: string;
  color: string;
}
