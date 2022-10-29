import { ImagesModel } from './imagesModel';

export interface inviteLinkModel {
  already_used: boolean;
  email: string;
  expired: false;
  has_to_register: boolean;
  images: ImagesModel;
  organization: string;
}
