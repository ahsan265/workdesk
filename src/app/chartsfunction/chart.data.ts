import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartsData {
    constructor()
    {

    }
    calculateChartData(val:Array<any>)
    {
      let data:any=[]
      val.forEach(element => {
        if(element.count==null)
        {
          data.push(0)
        }
        else
        {
          data.push(element.count)
        }
      });
      return data;
    }
}
