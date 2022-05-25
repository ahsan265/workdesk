import { Injectable } from "@angular/core";
import { promise } from "protractor";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { MessageService } from "./messege.service";

@Injectable({
    providedIn: 'root'
  })
  export class webrtcsocket {
    protected websocket_url = `${environment.websocket_url}`;
    callobject$: Observable<any>;
    ws:WebSocket;
    private callsubject = new Subject<any>();
    constructor(private message:MessageService)
    {
       this.callobject$=this.callsubject.asObservable().pipe();  
    }
   public async callUserSocket(calluuid,userid,is_refresh):Promise <any>
    {
      console.log(calluuid,userid,is_refresh)
        let  url=this.websocket_url+"/webrtc?call_uuid="+calluuid+"&peer_id="+userid+"&is_refreshed="+is_refresh;
        this.ws = new WebSocket(url);
        this.ws.onopen=(e)=>{
          this.message.setErrorMessage("conection :"+ e.type);
        }
        // recieve data and send it to required place
        this.ws.onmessage=async (e)=>{
          if(e.data!="ping")
          {
            let msg =JSON.parse(e.data);
            await   this.callsubject.next(msg);
          }
           
        }

        // check error 
        this.ws.onerror=(e)=>{
            this.message.setErrorMessage(e.type);
        }

    }
    // send data to webrtc 
    sendDataforCall(val)
    {
      this.ws.send(JSON.stringify(val))
    }

    // close the websocket
    closeWebsocket()
    {
      this.ws.close()
    }
}