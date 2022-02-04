import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { MessageService } from "./messege.service";
import { sharedres_service } from "./sharedres.service";

@Injectable({
    providedIn: 'root'
  })
  export class webrtcsocket {
    protected websocket_url = `${environment.websocket_url}`;
    callobject$: Observable<any>;
    ws:  WebSocket;
    private callsubject = new Subject<any>();
    constructor(private message:MessageService,private sharedres:sharedres_service)
    {
       this.callobject$=this.callsubject.asObservable().pipe();  
    }
    callUserSocket(calluuid)
    {

        let  url=this.websocket_url+"/gigaaa-webrtc?call_uuid="+calluuid;
        this.ws = new WebSocket(url);
        // open the connection for websocket
        
        this.ws.onopen=(e)=>{
          this.message.setErrorMessage("conection :"+ e.type);
        }
        // recieve data and send it to required place
        this.ws.onmessage=(e)=>{
          if(e.data!="ping")
          {
            let msg =JSON.parse(e.data);
            this.callsubject.next(msg);
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
      console.log(val)
      this.ws.send(JSON.stringify(val))
    }
}