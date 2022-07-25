
export interface QueueSocketparamter {
  call_type: string[];
  languages: number[];
  tab: string;
}
export interface QueueList {
  finished: QueueListFinished[];
  incoming: QueueListIncoming[];
  missed: QueueListMissed[];
  new_call: boolean;
  ongoing: QueueListOngoing[];
}
export interface QueueListMissed {
  browser: string;
  call_uuid: string;
  desktop: boolean;
  device?: boolean;
  is_video: boolean;
  language_icon: string;
  language_id: number;
  missed_at: string;
  mobile: boolean;
  name: string;
  operating_system: string;
  reason: string;
  tablet: boolean;
  user_id?: number;
  wait_time: number;
  waiting_started_at: string;
}

export interface QueueListFinished {
  agent_joined: boolean;
  browser: string;
  call_ended_at: string;
  call_started_at: string;
  call_time: number;
  call_uuid: string;
  desktop: boolean;
  device?: boolean;
  is_video: boolean;
  language_icon: string;
  language_id: number;
  mobile: boolean;
  name: string;
  operating_system: string;
  tablet: boolean;
  user_id?: number;
  user_joined: boolean;
  wait_time: number;
  waiting_started_at: string;
}
// for ongoing tab
export interface QueueListOngoing {}
// for incoming tab
export interface QueueListIncoming {}
// for send data param
export interface QueueDateRangeParam {
  end_date: string;
  start_date: string;
  tab: string;
}
