import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { access } from 'node:fs';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { GigaaaApiService } from './gigaaaapi.service';
import { MessageService } from './messege.service';

@Injectable({
  providedIn: 'root'
})
export class sharedres_service {
  inviteduserdata:any;
  inviteduserdetails$: Observable<any>;
  private inviteduserdetailssubject = new Subject<any>();

  refreshagentlist$: Observable<any>;
  private refreshagentlistsubject = new Subject<any>();

    submitapplication$: Observable<any>;
    private submitappsubject = new Subject<any>();

    agentrole$: Observable<any>;
    private agentrolesubject = new Subject<any>();

    agentsetting$: Observable<any>;
    private agentsettingsubject = new Subject<any>();

    agentsprofilesetting$: Observable<any>;
    private agentsprofilesettingsubject = new Subject<any>();

    runsocketapiusingint_id$: Observable<any>;
    private runsocketapiusingint_idsubject = new Subject<any>();

    runthesocketforagent$: Observable<any>;
    private runthesocketforagent_subject = new Subject<any>();

    sendsearchqueryforagent$: Observable<any>;
    private sendsearchqueryforagent_subject = new Subject<any>();

    loadagentwithlanguages$: Observable<any>;
    private loadagentwithlanguages_subject = new Subject<any>();

    sendpicture$: Observable<any>;
    private sendpciture_subject = new Subject<any>();

    sendcallsearchfilter$: Observable<any>;
    private sendcallsearchfilter_subject = new Subject<any>();

    sendcalllanguagesfilter$: Observable<any>;
    private sendcalllanguagesfilter_subject = new Subject<any>();

    senddaterangecallmobilefilter$: Observable<any>;
    private senddaterangecallmobilefilter_subject = new Subject<any>();


    sendparamfromdashboardpopup$: Observable<any>;
    private sendparamfromdashboardpopup_subject = new Subject<any>();
    
    sendtrigger_message$: Observable<any>;
    private sendtrigger_message_subject = new Subject<any>();
    constructor(private gigaaaapi:GigaaaApiService,
      private router: ActivatedRoute,

      private message:MessageService) {
      //  this.getuserole();
        this.agentsetting$ = this.agentsettingsubject.asObservable().pipe();
        this.submitapplication$ = this.submitappsubject.asObservable().pipe()
        this.agentrole$=this.agentrolesubject.asObservable().pipe();
        this.refreshagentlist$=this.refreshagentlistsubject.asObservable().pipe();
        this.agentsprofilesetting$=this.agentsprofilesettingsubject.asObservable().pipe();
        this.inviteduserdetails$=this.inviteduserdetailssubject.asObservable().pipe();
        this.runsocketapiusingint_id$=this.runsocketapiusingint_idsubject.asObservable().pipe();
        this.runthesocketforagent$=this.runthesocketforagent_subject.asObservable().pipe();
        this.sendsearchqueryforagent$=this.sendsearchqueryforagent_subject.asObservable().pipe();
        this.loadagentwithlanguages$=this.loadagentwithlanguages_subject.asObservable().pipe();
        this.sendpicture$=this.sendpciture_subject.asObservable().pipe();
        this.sendcallsearchfilter$=this.sendcallsearchfilter_subject.asObservable().pipe();
        this.sendcalllanguagesfilter$=this.sendcalllanguagesfilter_subject.asObservable().pipe();
        this.senddaterangecallmobilefilter$=this.senddaterangecallmobilefilter_subject.asObservable().pipe();

        this.sendtrigger_message$=this.sendtrigger_message_subject.asObservable().pipe();
        this.sendparamfromdashboardpopup$=this.sendparamfromdashboardpopup_subject.asObservable().pipe();

    }
    getintegrationrelation(intid:any) {
       console.log(intid)
    this.submitappsubject.next({int_id:intid});
 }
 getagentsettingview(val)

{ this.agentsettingsubject.next(val);

}

public getuserole()
{  const getdata = JSON.parse(localStorage.getItem('gigaaa-subscription'))
var accesstoken=getdata?.access_token;
var uuid=getdata?.subscription_id.subsid.uuid;
if(accesstoken!=null &&uuid !=null)
{
  try{


        const intid = JSON.parse(localStorage.getItem('intgid'))
        if(intid!=null)
        {
          this.gigaaaapi.getroleofagent(accesstoken,uuid,intid?.int_id).subscribe(data=>{
            this.agentrolesubject.next(data);

          }) }
  }

  catch(err)
  {
   this.message.setErrorMessage(err.error);
  }
}
}

// get refresh agent list

getrefreshagentlist(val)
{
  this.refreshagentlistsubject.next(val);
}
// get agent settings view with respect to invitation status
getagentprofilesetting(val)
{
 this.agentsprofilesettingsubject.next(val);
}

getinivationdetail()
{
  var code;
  this.router.queryParams.subscribe(data=>{
    code=  data['invitation_code']
    console.log(code)

    if(code!=null)
    {    localStorage.setItem('gigaaa-invitation', JSON.stringify(code))

    this.gigaaaapi.getinvitationdetails(code).subscribe(data=>{
      console.log(data)
    this.inviteduserdetailssubject.next(data);


    },err=>{
      this.message.setErrorMessage(err.error.error);
   this.inviteduserdetailssubject.next(null);

    })
  }
  })

}

// get run socket api
getcallsocketapi(val){
this.runsocketapiusingint_idsubject.next(val)
}


// runagentsocket
runagentsocket(val)
{
  this.runthesocketforagent_subject.next(val)
}
// send search query
sendsearchquery(val)
{
  this.sendsearchqueryforagent_subject.next(val);
}
// load agent with respect to languages from mobile filter 

sendlanguagestoagentpage_mobilefilter(val)
{
  this.loadagentwithlanguages_subject.next(val);
}
// send picture updated for agents

sendpictureupdated(val)
{
  this.sendpciture_subject.next(val);
}

// send call languages for agents

send_call_languages_filter(val)
{
  this.sendcalllanguagesfilter_subject.next(val);
}
// send call search for agents

Send_call_search_filter(val)
{
  this.sendcallsearchfilter_subject.next(val);
}

// send date range call filter

Send_call_daterange_filter(val)
{
  this.senddaterangecallmobilefilter_subject.next(val);
}
// send trigger message to call page 
send_trigger_message(val)
{
  this.sendtrigger_message_subject.next(val)
}
// send params from dashboard popup
send_param_from_dashboard(val)
{
  this.sendparamfromdashboardpopup_subject.next(val)
}
}
