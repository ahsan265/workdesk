export interface NotificationModels {
  type: string;
  data: NotificationDataModel;
}

export interface NotificationDataModel {
  id: number;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface NotificationComponentModel {
  header: string;
  date: string;
  message: string;
  isOpen: boolean;
  icon: string;
  id: number;
}
