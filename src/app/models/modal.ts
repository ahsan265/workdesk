import { Button } from './button';

export interface Modal {
  title: string;
  image?: string;
  onlyOneButton: boolean;
  buttonOne: Button;
  buttonTwo?: Button;
  width: string;
  height: string;
}

