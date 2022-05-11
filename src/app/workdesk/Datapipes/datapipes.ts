import { Pipe, PipeTransform } from '@angular/core';
import { sharedres_service } from 'src/app/service/sharedres.service';

@Pipe({
  name: 'getpicture',
})
export class getloadpictures implements PipeTransform{

  transform(value: any) {
    return this.getpicture(value);
  }

  // get pictures
  getpicture(val)
  {   const status = JSON.parse(localStorage.getItem('user-status'));
      if(status!=null)
      {
        return val;
      }
      else{
        var timestamp = new Date().getTime();
        return val+ '?_=' + timestamp;;
      }
  
  }

}