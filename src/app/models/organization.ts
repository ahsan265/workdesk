
export interface Organization {
    id?: number;
    contact_email?: string;
    contact_person?: string;
    image_name?: string;
    last_used?: boolean;
    name?: string;
    projects: Project[];
    uuid: string
    whmcs_id: string
  }

  export interface Project
  {
    last_used?: boolean
    uuid?: string
    organization_id?: number
  }