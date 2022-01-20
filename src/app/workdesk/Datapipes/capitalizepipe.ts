import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Uppercase',
})
export class getcapitalletter implements PipeTransform{
  transform(value: any) {
    return this.titleCaseWord(value);
  }

  // get capitaletter
  titleCaseWord(word: string) {
      if(word!=null)
      {
        return word[0].toUpperCase() + word.substr(1).toLowerCase();

      }
  }
    

}