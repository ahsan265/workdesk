import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getbrowser',
})
export class getbrowserpipes implements PipeTransform{
  transform(value: any) {
    return this.getbrowser(value);
  }

  // get pictures
  getbrowser(val)
  {  
    if(val=="Chrome")
    {
     return "../../../assets/assets_workdesk/browsers/chrome.svg";
    }
    else if(val=="Firefox")
    {
     return "../../../assets/assets_workdesk/browsers/firefox.svg";
    }
    else if(val=="Safari") {
     return "../../../assets/assets_workdesk/browsers/safari.svg";
    }
    else if(val=="Opera") {
     return "../../../assets/assets_workdesk/browsers/opera.svg";
   }
    else if(val=="Opera Touch") {
     return "../../../assets/assets_workdesk/browsers/opera.svg";
   }
   else if(val=="edge") {
     return "../../../assets/assets_workdesk/browsers/default_browser_icon.svg";
   }
   else if(val==null)
   {
     return "../../../assets/assets_workdesk/browsers/default_browser_icon.svg";
   }
   else
     {
       return "../../../assets/assets_workdesk/browsers/default_browser_icon.svg";
     }
  }
}