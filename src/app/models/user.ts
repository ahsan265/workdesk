import { TableSettingsModel } from './agent';
import { Languages } from './languages';

export interface Profile {
  [x: string]: any;
  gender?: number;
  title?: any;
  first_name?: string;
  last_name?: string;
  about_me?: any;
  home_port?: any;
  image?: string;
  birthday?: string;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  language_id: string;
  api_token: string;
  block: number;
  created_at: string;
  avatar_url: string;
  avatar_url_tiny: string;
  is_tester: boolean;
  language: Languages;
  profile: Profile;
  timestamp: string;
  subscribed?: boolean;
}

export interface LoginCredentials {
  mobile_or_email?: string;
  password: string;
  grant_type?: string;
  client_id?: number;
  client_secret?: string;
  username?: string;
}

export interface UserData {
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
}

export interface MemberData {
  email: string;
  role: string;
  languages: [];
  isFirst: boolean;
}

export interface headerDataModel {
  value: string;
  headerInformation: TableSettingsModel;
}
