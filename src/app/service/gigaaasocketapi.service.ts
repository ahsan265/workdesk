import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
// import { type } from 'node:os';
// import { runInThisContext } from 'node:vm';
import { Observable, Observer } from 'rxjs';
import { Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { environment } from 'src/environments/environment';
import { GigaaaApiService } from './gigaaaapi.service';
import { MessageService } from './messege.service';
import { sharedres_service } from './sharedres.service';

@Injectable({
  providedIn: 'root'
})
export class gigaaasocketapi {
  protected websocket_url = `${environment.websocket_url}`;

  isopensocker:any=0;
  tokenque:any;
  tokenvisit:any;
  closestate:any;
  checksocketopen:boolean=false;
   currentStateofcallsocket:any;

  getlistofagentsinque$: Observable<any>;
  private getlistofagentsinquesubjecct = new Subject<any>();
   ws:  WebSocket;
  getlistofvisitor$: Observable<any>;
  private getlistofvisitorsubject = new Subject<any>();

  constructor(private message:MessageService,private sharedres:sharedres_service) {
    this.getlistofagentsinque$ = this.getlistofagentsinquesubjecct.asObservable().pipe();
    this.getlistofvisitor$=this.getlistofvisitorsubject.asObservable().pipe();
 
      this.getlistofliveque()
    this.callsocketapi_by_selecting_intgid();
  }

callsocketapi_by_selecting_intgid()
{ const socketvalue = JSON.parse(localStorage.getItem('gigaaa-socket'))
  this.sharedres.runsocketapiusingint_id$.subscribe(data=>{
    if(data==1&&socketvalue!=true)
    {
        this.getlistofliveque();
    }
  })
}

 public  getlistofliveque()
  {
    var getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
    var accesstoken=getdata?.api_token;
      var uuid=getdata?.subscription_id?.subsid.uuid;
      var intid = JSON.parse(localStorage.getItem('intgid'))
      var integrationid=intid?.int_id;
   if(accesstoken!=null&&uuid!=null&&integrationid!=null)
     {

      var  url=this.websocket_url+"/customer-support/queue?organization="+uuid+"&integration="+integrationid+"&token="+accesstoken;
     this.ws = new WebSocket(url);

     this.ws.onopen=(e)=>{
      this.isopensocker=1;
       this.sharedres.send_trigger_message(1);
        this.checksocketopen=true;
        localStorage.setItem('gigaaa-socket', JSON.stringify(this.checksocketopen));
      }

       this.ws.onmessage = (e) => {
      
        if(e.data !="ping")
        {
          var data=JSON.parse(e.data)
          this.getlistofagentsinquesubjecct.next(data);
          const online = JSON.parse(localStorage.getItem('user-status'))
          if(data['new_call']==true&&online==true)
            {
              this.getdesktopnotification("Customer Support","Please connect call")
            }
        }
        else {
          // const socketvalue = JSON.parse(localStorage.getItem('gigaaa-socket'))
          // if(socketvalue==true)
          // {
          //   this.ws.send("pong")

          // }
        }

      };

      this.ws.onerror=(e)=>{
      }
      this.ws.onclose=(e)=>{
        this.closestate=e.code;
      }

      }

  }



  getdesktopnotification(title:any,body:any)
  {
    Notification.requestPermission().then((permission)=>{
      if(permission="granted")
      {
        var notification = new Notification(title,{body:body,icon:'../../../assets/gigaaa_logo.png'});
        setTimeout(function(){
            notification.close();
        },3000);
      }

  });
  }
  // send params to get filter calls data
   sendfilterparams(data:any)
  { 
    this.currentStateofcallsocket=data;
    if(this.ws.readyState==this.ws.OPEN)
    {
      this.ws.send(JSON.stringify(data))    }
  }

  // send params to get filter calls data
  send_daterange_params(data:any)
  {
    if(this.ws.readyState==this.ws.OPEN)
    {
      this.ws.send(JSON.stringify(data))
    }
    }
    closewebsocketcalls()
    {  
        this.ws.close();
        this.message.setErrorMessage("Closed")
    }

}
