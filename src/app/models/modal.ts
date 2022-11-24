import { Button } from './button';
import { Organization } from './organization';

export interface Modal {
  title: string;
  image?: string;
  onlyOneButton: boolean;
  buttonOne: Button;
  buttonTwo?: Button;
  width: string;
  height: string;
}

