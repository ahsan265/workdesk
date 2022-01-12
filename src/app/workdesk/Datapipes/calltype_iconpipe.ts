import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'call_type',
})
export class getcalltypepipes implements PipeTransform{
  transform(value: any) {
    return this.getcalltype(value);
  }

  // get pictures
  getcalltype(val)
  {  
    if(val==false)
    return "../../../assets/assets_workdesk/request_type/audio.svg";
    
    else if (val==true){
      return "../../../assets/assets_workdesk/request_type/video.svg";
    }
    
}
}