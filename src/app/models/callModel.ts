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
export interface MissedCallTableModel {
  id: string;
  full_name: string;
  language_id: number;
  device_type: string;
  browser_name: string;
  os_name: string
  imageItem: CallerNameAndImageModel;
  called: string;
  wait_time: string;
  reason: string;
}
export interface AnsweredCallTableModel {
  id: string;
  full_name: string;
  language_id: number;
  device_type: string;
  browser_name: string;
  os_name: string
  call_type: CallerNameAndImageModel;
  called: string;
  agent_name: CallerNameAndImageModel;
}
export interface IncomingCallTableModel {
  id: string;
  queue_no: number;
  full_name: string;
  language_id: number;
  device_type: string;
  browser_name: string;
  os_name: string;
  call_type: CallerNameAndImageModel;
  wait_time: string;
}
export interface OngoingCallTableModel {
  id: string;
  full_name: string;
  language_id: number;
  device_type: string;
  browser_name: string;
  os_name: string;
  call_type: CallerNameAndImageModel;
  agent_name: CallerNameAndImageModel;
  wait_time: string;
}

export interface CallerNameAndImageModel {
  text: string;
  image: string;
}


