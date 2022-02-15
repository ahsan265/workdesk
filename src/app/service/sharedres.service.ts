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
   inviteduserdetailssubject = new Subject();
   refreshagentlistsubject = new Subject();
    submitappsubject = new Subject();
     agentrolesubject = new Subject<any>();
     agentsettingsubject = new Subject();
    agentsprofilesettingsubject = new Subject<any>();
    runsocketapiusingint_idsubject = new Subject<any>();
     runthesocketforagent_subject = new Subject<any>();
     sendsearchqueryforagent_subject = new Subject<any>();
     loadagentwithlanguages_subject = new Subject<any>();
     sendpciture_subject = new Subject<any>();
     sendcallsearchfilter_subject = new Subject<any>();
     sendcalllanguagesfilter_subject = new Subject<any>();
     senddaterangecallmobilefilter_subject = new Subject<any>();
     sendparamfromdashboardpopup_subject = new Subject<any>();
     sendtrigger_message_subject = new Subject<any>();
     sendtrigger_agentpage_subject = new Subject<any>();
     showagentListonloadSubject = new Subject<any>();
     devicerequestCallSubjecte = new Subject<any>();


    constructor(private gigaaaapi:GigaaaApiService,
      private router: ActivatedRoute,
      private message:MessageService) 
      {}


     // send integration
      public  async getintegrationrelation(val):Promise<any> {
       await   this.submitappsubject.next(val);
      }
      getagentsettingview(val)

      { this.agentsettingsubject.next(val);
      }

        public getuserole()
        {  const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
        var accesstoken=getdata?.api_token;
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
            if(code!=null)
            {    
              localStorage.setItem('gigaaa-invitation', JSON.stringify(code))
            this.gigaaaapi.getinvitationdetails(code).subscribe(data=>{
            this.inviteduserdetailssubject.next(data);
            },err=>{
              this.message.setErrorMessage(err.error.error);
          this.inviteduserdetailssubject.next(null);

            })
          }
          })

        }

        // get run socket api
      public async  getcallsocketapi(val):Promise <any> {
      await  this.runsocketapiusingint_idsubject.next(val)
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
          // show top and sidebar ()
          showagentListonload(val)
          {
            this.showagentListonloadSubject.next(val)
          }

          // send trigger to agent page 
          sendMessagetoAgent(val)
          {
            this.sendtrigger_agentpage_subject.next(val);
          }
          }
