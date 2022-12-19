export interface Organization {
  id?: number;
  contact_email?: string;
  contact_person?: string;
  image_name?: string;
  last_used?: boolean;
  name?: string;
  projects: Project[];
  uuid: string;
  whmcs_id: string;
  is_individual: boolean;
}

export interface Project {
  last_used: boolean;
  uuid: string;
  organization_id: number;
  description: string;
  id: number;
  product_id: number;
  public: false;
  title: string;
}

export interface sidebarDropdownData {
  last_used: boolean;
  name: string;
  uuid: string;
}
