import { Injectable } from "@angular/core";
import { commonEps } from "../commonEps/commonEps";
import { Card } from "../models/card";
import { GigaaaApiService } from "../services/gigaaaApiService";

@Injectable({
  providedIn: 'root'
})

export class DashboardEps  {
   
    constructor(private GigaaaApiService:GigaaaApiService,private commoneps:commonEps)
    {
       
        
    }
    // call the cards count endpoint for 
   public GetCardCountUsers()
    {
        const   epParams= this.commoneps.getEpsParamLocal();
        if(this.commoneps.getIdsOfLocation()!=undefined)
        {   console.log(this.commoneps.getIdsOfLocation())
            this.GigaaaApiService.getcallstatistics(epParams.token,
                epParams.organization,
                epParams.project,
                "this_week",this.commoneps.getIdsofLanguage(),this.commoneps.getIdsOfLocation()).subscribe((data:any)=>{
                const IncomingCard=data['incoming'];
                const percencateIncomingCard=this.getpercentagecalculated(IncomingCard.count);
                const missedCard=data['missed'];
                const percencateMissedCard=this.getpercentagecalculated(missedCard.count);
                const answeredCard=data['answered'];
                const percencateAwnseredCard=this.getpercentagecalculated(answeredCard.count);
                console.log(percencateAwnseredCard)
                 
            })
        }
   
    }

    // calculate percencate of cards value 
   private  getpercentagecalculated(val:number)
   {
    let  calculated:any;
    if(val!=null)
    {
      calculated=(val*100).toFixed(2);
      if(calculated>0)
      {
        return calculated;
      }
      else{     
        return calculated;
      }
    }
    else{
        return 0;
     }
     }

    

}
