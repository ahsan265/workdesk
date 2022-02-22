import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { MessageService } from "./messege.service";
import { sharedres_service } from "./sharedres.service";

@Injectable({
    providedIn: 'root'
  })
  export class agentsocketapi {
    protected websocket_url = `${environment.websocket_url}`;

    getagetnlist$: Observable<any>;
    private getagentlistsubject = new Subject<any>();
     ws:  WebSocket;
     issocketliveornot:any=0;
    constructor(private message:MessageService,private sharedres:sharedres_service)
     {    this.getagetnlist$ = this.getagentlistsubject.asObservable().pipe();
      const socketvalue = JSON.parse(localStorage.getItem('agent-socket'))
      if(socketvalue==true)
      {
       // this.getagentlive();
      }
     this.callsocketapi_by_selecting_intgid()
      }
        public  callsocketapi_by_selecting_intgid()
          { 
            this.sharedres.runsocketapiusingint_idsubject.subscribe(data=>{
              if(data==1)
              {
                  this.getagentlive();
                
                  
              }
        })
      
      }
      getagentlive()
      {
        const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
          let uuid=getdata?.subscription_id?.subsid.uuid;
          let intid = JSON.parse(localStorage.getItem('intgid'))
          const loggedinuser_uuid = JSON.parse(localStorage.getItem('userlogged_uuid'));

          var integrationid=intid?.int_id;

          if(loggedinuser_uuid?.uuid!=null&&uuid!=null&&integrationid!=null)
            { 
                  let  url=this.websocket_url+"/customer-support/agents?organization="+uuid+"&integration="+integrationid+"&agent="+loggedinuser_uuid?.uuid;
                  this.ws = new WebSocket(url);
                    this.ws.onopen=(e)=>{
                     
                      this.sharedres.sendMessagetoAgent(1);
                    }
                    this.ws.onmessage = (e) => {
                  
                   if(this.ws.OPEN==1&& e.data!=null)
                   {
                       if(e.data !="ping")
                       {
                        let data=JSON.parse(e.data)
                          data.forEach(element => {
                            if(element?.email==this.getsettingforloggedinagent())
                            {
                              if(element?.is_available==true&&element?.is_online==true)
                              {
                                localStorage.setItem('user-status', JSON.stringify(true));
                                this.sharedres.runagentsocket(1);
                              }
                              else{
                                localStorage.setItem('user-status', JSON.stringify(false));
                                this.sharedres.runagentsocket(1);
                              }
                            }
                            });
                            this.getagentlistsubject.next(data)
                          }
                    }
                    }
                    this.ws.onerror=(e)=>{
                    }
                    this.ws.onclose=(e)=>{
                    }

      }
    }

    // send online away status
    send_isonline_status(data:boolean)
    {  if(this.ws.readyState==this.ws.OPEN)
      {
        var object= {"action": "update_status", "data":{"action": "is_available", "value":data}}
     
        this.ws.send(JSON.stringify(object))    
      }
      }

          // send agents params
    send_agentsparam_status(invited:any,active:any,inactive:any,languages:Array<any>)
    { 
      if(this.ws.OPEN==1)
      {var object= {"action": "filter", "data":{"languages": languages, "invited":invited, "active":active, "inactive":inactive}}
     
        this.ws.send(JSON.stringify(object))    
    }
      }

      // close agent socket
     public async closeagentsocket():Promise<void>
      {     
      await    this.ws.close()
      }
      // get loggedin Email

      getsettingforloggedinagent()
      {

         const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
        return getdata?.email;  
      }
}