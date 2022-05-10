import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timecalculatorlong',
})
export class gettimecalculatorlong implements PipeTransform{
  transform(value: any,slot:any) {
    console.log(value,slot)
    return this.gettimedurationformissedandanswered(value,slot);
  }

  // get capitaletter
  gettimedurationformissedandanswered(val,seletedrange)
  {
 
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
    const Days=['Mon',	'Tue'	,'Wed',	'Thu'	,'Fri',	'Sat',	'Sun']
    
    let myDate = new Date(val);
    if(seletedrange=="Today"|| seletedrange=="Yesterday")
    {
      let  time = ("0" + myDate.getHours()).slice(-2) + ":" + ("0" +myDate.getMinutes()).slice(-2)
      return time;
    }
    else if(seletedrange=="This month" || seletedrange=="Last month")
    {
      let  time =monthNames[myDate.getMonth()] +'\xa0'+  myDate.getDate()  +'\xa0'+ ("0" + myDate.getHours()).slice(-2) + ":" + ("0" +myDate.getMinutes()).slice(-2);
      return time;
    }
    else if(seletedrange=="This week" || seletedrange=="Last week")
    {
      let  time =monthNames[myDate.getMonth()] +'\xa0'+  myDate.getDate()  +'\xa0'+ ("0" + myDate.getHours()).slice(-2) + ":" + ("0" +myDate.getMinutes()).slice(-2);
      return time;
    }
    else if(seletedrange=="This year" || seletedrange=="Last year")
    {
      let  time =monthNames[myDate.getMonth()] +'\xa0'+  myDate.getDate()  +'\xa0'+ ("0" + myDate.getHours()).slice(-2) + ":" + ("0" +myDate.getMinutes()).slice(-2);
      return time;
    }
    else if(seletedrange=="custom"){
      let  time = ("0" + myDate.getHours()).slice(-2) + ":" + ("0" +myDate.getMinutes()).slice(-2)
      return time;
    }
   
  }
    

}