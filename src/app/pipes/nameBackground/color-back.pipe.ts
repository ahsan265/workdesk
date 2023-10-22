import { Pipe, PipeTransform } from '@angular/core';
import * as color from 'string-to-color';

@Pipe({
  name: 'colorBack'
})
export class ColorBackPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    if (value === null) {
      return '#715DFF';
    } else {
      return color.default(value + args[0]);
    }
  }
}
