import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getdevice',
})
export class getdevicepipes implements PipeTransform{
  transform(value: any) {
    return this.getdevice(value);
  }

  // get pictures
  getdevice(val)
  {  
    if(val==true)
    {
     return "../../../assets/assets_workdesk/device/mobile.svg"; 
    }
   else if(val==false)
   {
     return "../../../assets/assets_workdesk/device/desktop.svg";
   }
}
}