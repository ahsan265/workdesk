import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameInitials'
})
export class NameInitialsPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return this.getNameInitials(value, args[0]);
  }

  getNameInitials(firstName: string, lastName: string) {
    let firstNameInitials = firstName.toUpperCase().charAt(0);
    let secondNameInitials = lastName.toUpperCase().charAt(0);
    return firstNameInitials + secondNameInitials;
  }
}
