import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'call_type_text',
})
export class getcalltypetextpipes implements PipeTransform{
  transform(value: any) {
    return this.getcalltypetext(value);
  }

  // get pictures
  getcalltypetext(val)
  {  
    if(val==false)
    return "Audio Call";
    else  if(val==true){
      return "Video Call";
    }
    
}
}