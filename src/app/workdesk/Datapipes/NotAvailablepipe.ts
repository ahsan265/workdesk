import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nA',
})
export class notAvailable implements PipeTransform{
  transform(value: any) {
    return this.notavailable(value);
  }

  // get pictures
  notavailable(val)
  {  
        if (val == null) {
       return 'N/A';
        
            }
        else 
        {
            return val;
        }
}
}