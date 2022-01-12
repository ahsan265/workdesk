import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getos',
})
export class getospipes implements PipeTransform{
  transform(value: any) {
    return this.getos(value);
  }

  // get pictures
  getos(val)
  {  
    if(val=="macOS")
    {
     return "../../../assets/assets_workdesk/os/apple.svg";
    }
    else if(val=="iOS")
    {
     return "../../../assets/assets_workdesk/os/apple.svg";
    }
    else if(val=="Windows") {
     return "../../../assets/assets_workdesk/os/Windows.svg";
    }
    else if(val=="Android") {
     return "../../../assets/assets_workdesk/os/android.svg";
    }
   else if(val=="Linux")
   {
     return "../../../assets/assets_workdesk/os/linux.svg";
   }
   else{
     {
       return "../../../assets/assets_workdesk/os/Windows.svg";
     }
   }
}
}