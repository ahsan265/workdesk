import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flagpipes',
})
export class getflagpipes implements PipeTransform{
  transform(value: any) {
    return this.getFlag(value);
  }

  // get pictures
  getFlag(val)
  {  
    if(val=="en")
    {
  return '../../../assets/assets_workdesk/Flags/us_flag.svg'
    }
    else if(val=="de") {
     return '../../../assets/assets_workdesk/Flags/german.svg'
 
    }
    else if(val=="ar") {
     return '../../../assets/assets_workdesk/Flags/arabic.svg'
 
   }
   else if(val=="es") {
     return '../../../assets/assets_workdesk/Flags/spanish.svg'
 
   }
   else if(val=="ru") {
     return '../../../assets/assets_workdesk/Flags/russian.svg'
 
   }
   else if(val=="tr") {
     return '../../../assets/assets_workdesk/Flags/turkish.svg'
 
   }
   else if(val=="ur") {
    return '../../../assets/assets_workdesk/Flags/Flag_of_Pakistan.svg'
  }
   else
   {
     return '../../../assets/Wikipedia-Flags-DE-Germany-Flag_27.svg'
 
   }
  }
}