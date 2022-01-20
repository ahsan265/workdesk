import { Injectable } from '@angular/core';
import { User, UserData, LoginCredentials, Profile, subsdata, assignrole } from '../model/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})

export class GigaaaApiService  {
  getagentdata$: Observable<any>;

  private agentdatasubject = new Subject<any>();

  protected API_URL = `${environment.apiUrl}`;
  protected oauthUrl = `${environment.oauth_url}`;

  private userapiUrl = `${environment.logged_user}`;
  private workdeskurl_cs=`${environment.prod_url_cs}`;
  private gigaabackendUlr=`${environment.prod_url_workdesk}`;
  private workdeskanalytics=`${environment.prod_anlytics}`;
  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };
  constructor(private http: HttpClient, private authService: AuthService) {
    this.getagentdata$ = this.agentdatasubject.asObservable().pipe();
}

// Auth endpoint

getHeaders() {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${this.authService.token.access_token}`
  }
}

getCurrentUser(token):Observable<User> {
  return this.http.get<User>(`${this.API_URL}/current-user`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }})
}





  public async updatePassword(access_token: string, passwordPayload: any,USER_ID:any): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
      })
    };
    return await this.http.put(this.userapiUrl+`/users/${USER_ID}`, passwordPayload, httpOptions).toPromise();
  }

  public getAllCountries(accesstoken: string): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accesstoken}`
      })
    };
    return this.http.get(this.gigaabackendUlr+'/public/countries', httpOptions).toPromise();
  }

  public getAllLanguages(accesstoken: string,orgid:string,intid:string): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accesstoken}`
      })
    };
    return this.http.get(this.workdeskurl_cs+"/private/languages?organization="+orgid+"&integration="+intid, httpOptions).toPromise();
  }

  public forgotPassword(email: string) {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      })
    };
    let body = { email };

    return this.http.post(`https://gigaaa-core.westeurope.cloudapp.azure.com/password/email`, body, httpOptions);
  }



  public  async getsubsid(accesstoken:any)
  {   const httpOptions: any = {

    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json,*/*',
      'Authorization': `Bearer ${accesstoken}`
    })
  };
   
   return await this.http.get(this.gigaabackendUlr+"/organization",httpOptions).toPromise()
     .catch((err) => {
       throw (err);
     });
   }

   public   getallagents(accesstoken:string,subsid:string,intid:string,show_active:number,show_invited:number,show_inactive:number,languages:any)
   {
     const httpOptions: any = {

     headers: new HttpHeaders({
       'Content-Type': 'application/json',
       'Accept': 'application/json,*/*',
       'Authorization': `Bearer ${accesstoken}`
     })
   };
    return this.http.get(this.workdeskurl_cs+"/private/agents?show_active="+show_active+"&show_invited="+show_invited+"&show_inactive="+show_inactive+"&languages="+languages+"&organization="+subsid+"&integration="+intid,httpOptions)

    }


    public   getallstats(accesstoken:string,subsid:string,intid:string)
    {   const httpOptions: any = {

      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json,*/*',
        'Authorization': `Bearer ${accesstoken}`
      })
    };
     return  this.http.get(this.workdeskurl_cs+"/statistics?subscription="+subsid+"&integration="+intid,httpOptions)

     }

     public   getalllistofqueueagent(accesstoken:string,orgid:string,intid:string)
     {   const httpOptions: any = {

       headers: new HttpHeaders({
         'Content-Type': 'application/json',
         'Accept': 'application/json',
         'Authorization': `Bearer ${accesstoken}`
       })
     };
 
      return  this.http.get(this.workdeskurl_cs+"queue?organization="+orgid+"&integration="+intid+"&languages=",httpOptions)

      }

      public   getagentinforusingid(accesstoken:string,subsid:string ,id:number)
      {   const httpOptions: any = {

        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json,*/*',
          'Authorization': `Bearer ${accesstoken}`
        })
      };
       return  this.http.get(this.workdeskurl_cs+"/queue/"+id+"?subscription="+subsid,httpOptions)

       }
       public   getallintegration(accesstoken:string,uuid:string)
       {   const httpOptions: any = {

         headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Accept': 'application/json',
           'Authorization': `Bearer ${accesstoken}`
         })
       };
        return  this.http.get(this.workdeskurl_cs+"/private/integrations?organization="+uuid,httpOptions)

        }
        public async updatelastusedintegration(accesstoken:string,uuid:string,integrationbody:any)
       {
          const httpOptions: any = {

         headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Accept': 'application/json',
           'Authorization': `Bearer ${accesstoken}`
         })
       };
        return await this.http.put(this.workdeskurl_cs+"/private/integrations?organization="+uuid,integrationbody,httpOptions).toPromise()
        .catch((err) => {
          throw (err);
        });

        }

   public  async assignrole(accesstoken:string,subsid:string,addrole:assignrole): Promise<any>
   {   const httpOptions: any = {
        method: 'POST',
        headers: new HttpHeaders({
       'Content-Type': 'application/json',
       'Accept': 'application/json',
       'Authorization': `Bearer ${accesstoken}`
     })
   };
    return await this.http.post(this.workdeskurl_cs+"/agents?subscription="+subsid,addrole,httpOptions).toPromise()
      .catch((err) => {
        throw (err);
      });
    }

    public  async getcalltype(accesstoken:string,orguuid:string,intid:string,id:any): Promise<any>
    {   const httpOptions: any = {
         method: 'POST',
         headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accesstoken}`
      })
    };
     return await this.http.post(this.workdeskurl_cs+"/private/start-call?organization="+orguuid+"&integration="+intid,id,httpOptions).toPromise()
       .catch((err) => {
         throw (err);
       });
     }
     //  logged inagent upload pic
     public   uploaduserprofilepic(accesstoken:string,subsid:string,intgid:string,file: File)
     {   const httpOptions: any = {
          method: 'POST',
          headers: new HttpHeaders({
         'Authorization': `Bearer ${accesstoken}`
       }),
       reportProgress:true,
       observe:'events'
     };
      var formdata = new FormData();
      formdata.append("image",file);
      return  this.http.post(this.workdeskurl_cs+"/private/agents/image?organization="+subsid+"&integration="+intgid,formdata,httpOptions);
      }
      // agent upload pic by admin
      public   agentuploaduserprofilepic(accesstoken:string,orgid:string,intgid:String,uuid:string ,file: File)
      {   const httpOptions: any = {
           method: 'POST',
           headers: new HttpHeaders({
          'Authorization': `Bearer ${accesstoken}`
        }),
        reportProgress:true,
        observe:'events'
      };
       var formdata = new FormData();
       formdata.append("image",file);
       return  this.http.post(this.workdeskurl_cs+"/private/agents/image?organization="+orgid+"&integration="+intgid+"&agent="+uuid,formdata,httpOptions);
       }
    public  async editagent(accesstoken:string,subsid:string,id:number,addrole:any): Promise<any>
   {   const httpOptions: any = {
        method: 'PUT',
        headers: new HttpHeaders({
       'Content-Type': 'application/json',
       'Accept': 'application/json',
       'Authorization': `Bearer ${accesstoken}`
     })
   };
    return await this.http.put(this.workdeskurl_cs+"/customer-support/agents/"+id+"?subscription="+subsid,addrole,httpOptions).toPromise()
      .catch((err) => {
        throw (err);
      });
    }
  

      //get visitors
      public   getvisitorlist(accesstoken:string,orgid:string,intid:string)
      {   const httpOptions: any = {

           headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accesstoken}`
        })
      };
       return  this.http.get(this.gigaabackendUlr+"/workdesk/visitors?organization="+orgid+"&integration="+intid,httpOptions)
       }

       //get visitors
      public   getroleofagent(accesstoken:string,orgid:string,intid:string)
      {   const httpOptions: any = {

           headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accesstoken}`
        })
      };
       return  this.http.get(this.workdeskurl_cs+"/private/is-admin?organization="+orgid+"&integration="+intid,httpOptions)
       }


       // get token for agents socket api
       public   getsockettoken(accesstoken:string,orgid:string,intid:string)
       {   const httpOptions: any = {

            headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Accept': 'application/json',
           'Authorization': `Bearer ${accesstoken}`
         })
       };
        return  this.http.get(this.workdeskurl_cs+"queue/websocket/access-token?organization="+orgid+"&integration="+intid,httpOptions)
        }

    
          // invite agent endpoint

          public  async getinviteagent(accesstoken:string,uuid:string,intid:string,agentdata:any): Promise<any>
          {   const httpOptions: any = {
               method: 'POST',
               headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${accesstoken}`
            })
          };
           return await this.http.post(this.workdeskurl_cs+"/private/invitation?organization="+uuid+"&integration="+intid,agentdata,httpOptions).toPromise()
             .catch((err) => {
               throw (err);
             });
           }

//post refeeral code for agents invited
           public  async sendinvitationcode(accesstoken:string,agentdata:any): Promise<any>
           {   const httpOptions: any = {
                headers: new HttpHeaders({
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Authorization': `Bearer ${accesstoken}`
             })
           };
            return await this.http.put(this.workdeskurl_cs+"/public/invitation/accept?code",agentdata,httpOptions).toPromise()
              .catch((err) => {
                throw (err);
              });
            }

    // delete agents
    public async  deleteagent(accesstoken:string,orgid:string,intid:string,agentuuid:any): Promise<any>
        {
          const httpOptions: any = {
            headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Accept': 'application/json',
           'Authorization': `Bearer ${accesstoken}`
         })
         };
        return  this.http.delete(this.workdeskurl_cs+"/private/agents/"+agentuuid+"?organization="+orgid+"&integration="+intid,httpOptions).toPromise()
        .catch((err) => {
          throw (err);
        });
        }

        // get agent online status
        public   getagentonlinestatus(accesstoken:string,orgid:string,intid:string)
        {   const httpOptions: any = {
            headers: new HttpHeaders({
           'Content-Type': 'application/json',
           'Accept': 'application/json',
           'Authorization': `Bearer ${accesstoken}`
         })
         };
        return  this.http.get(this.workdeskurl_cs+"/private/is-online?organization="+orgid+"&integration="+intid,httpOptions)
        }
          // set online status
          public  async putonlinestatus(accesstoken:string,orgid:string,intid:string,online:any): Promise<any>
          {   const httpOptions: any = {
               method: 'POST',
               headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${accesstoken}`
            })
          };
           return await this.http.put(this.workdeskurl_cs+"/private/is-online?organization="+orgid+"&integration="+intid,online,httpOptions).toPromise()
             .catch((err) => {
               throw (err);
             });
           }

            // resend invitation
            public  async resendinvitation(accesstoken:string,orgid:string,intid:string,agentuuid:any): Promise<any>
            {
              const httpOptions: any = {

              headers: new HttpHeaders({
             'Content-Type': 'application/json',
             'Accept': 'application/json',
             'Authorization': `Bearer ${accesstoken}`
             })
             };
             return await this.http.post(this.workdeskurl_cs+"/private/invitation/resend?agent="+agentuuid+"&organization="+orgid+"&integration="+intid,{},httpOptions).toPromise()
               .catch((err) => {
                 throw (err);
               });
             }

             // update agent settings

             public  async updateagentsettings(accesstoken:string,orgid:string,intid:string,agentuuid:any,agentbody:any): Promise<any>
             {
               const httpOptions: any = {

               headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${accesstoken}`
              })
              };
              return await this.http.put(this.workdeskurl_cs+"/private/agents/"+agentuuid+"?organization="+orgid+"&integration="+intid,agentbody,httpOptions).toPromise()
                .catch((err) => {
                  throw (err);
                });
                }

              // get invitation status
             public   getinvitationdetails(code:string)
             {   const httpOptions: any = {
                 headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              })
              };
             return  this.http.get(this.workdeskurl_cs+"/public/invitation?code="+code,httpOptions)
             }
                // get call stats
           public   getcallstatistics(accesstoken:string,orgid:string,intid:string,time:string,languages:Array<any>,countries:Array<any>)
                {   const httpOptions: any = {
                    headers: new HttpHeaders({
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'Authorization': `Bearer ${accesstoken}`
                 })
                 };
                return  this.http.get(this.workdeskanalytics+"/private/cs/counts?organization="+orgid+"&integration="+intid+"&time="+time+"&languages="+languages+"&countries="+countries,httpOptions)
          }

                 // get call chart
                 public   getcallchart(accesstoken:string,orgid:string,intid:string,time:string,languages:Array<any>,countries:Array<any>,date_from:string,date_to:string)
                 {  
                   const httpOptions: any = {
                     headers: new HttpHeaders({
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'Authorization': `Bearer ${accesstoken}`
                  })
                  };

                 return  this.http.get(this.workdeskanalytics+"/private/cs/aggregates?organization="+orgid+"&integration="+intid+"&time="+time+"&languages="+languages+"&countries="+countries+"&date_from="+date_from+"&date_to="+date_to,httpOptions)
                 }

                  // get user line graphs
                  public   getuserline_Graph_Cards_Data(accesstoken:string,orgid:string,intid:string,date_from:string,date_to:string,languages:Array<any>,countries:Array<any>,time:string)
                  { 
                    const httpOptions: any = {
                      headers: new HttpHeaders({
                       'Content-Type': 'application/json',
                       'Accept': 'application/json',
                       'Authorization': `Bearer ${accesstoken}`
                   })
                   };
 
                  return  this.http.get(this.workdeskanalytics+"/private/plugin/stats/users?organization="+orgid+"&integration="+intid+"&date_from="+date_from+"&date_to="+date_to+"&languages="+languages+"&countries="+countries+"&date_range=including"+"&time="+time,httpOptions)
                  }
                  // get visitor line graphs
                  public   getvisitor_Graph_cards_Data(accesstoken:string,orgid:string,intid:string,date_from:string,date_to:string,languages:Array<any>,countries:Array<any>,time:string)
                  { 
                    const httpOptions: any = {
                      headers: new HttpHeaders({
                       'Content-Type': 'application/json',
                       'Accept': 'application/json',
                       'Authorization': `Bearer ${accesstoken}`
                   })
                   };
 
                  return  this.http.get(this.workdeskanalytics+"/private/plugin/stats/visitors?organization="+orgid+"&integration="+intid+"&date_from="+date_from+"&date_to="+date_to+"&languages="+languages+"&countries="+countries+"&date_range=including"+"&time="+time,httpOptions)
                  }
                 // get loggedin agent uuid
                 getloggedinagentuuid(accesstoken:string,orgid:string,intid:string)
                 {
                  const httpOptions: any = {
                    headers: new HttpHeaders({
                     'Content-Type': 'application/json',
                     'Accept': 'application/json',
                     'Authorization': `Bearer ${accesstoken}`
                 })
                 };

                return  this.http.get(this.workdeskurl_cs+"/private/agent?organization="+orgid+"&integration="+intid,httpOptions)
                 }

                 // get user counts for cards
                 // total
                 public   getUserCountsTotal(accesstoken:string,orgid:string,intid:string,time:string,languages:Array<any>,countries:Array<any>)
                 {   const httpOptions: any = {
                     headers: new HttpHeaders({
                       'Content-Type': 'application/json',
                       'Accept': 'application/json',
                       'Authorization': `Bearer ${accesstoken}`
                  })
                  };
                  return  this.http.get(this.workdeskanalytics+"/private/plugin/users/total?organization="+orgid+"&integration="+intid+"&time="+time+"&languages="+languages+"&countries="+countries,httpOptions)
                }
                  // Unique
                  public   getUserCountsUnique(accesstoken:string,orgid:string,intid:string,time:string,languages:Array<any>,countries:Array<any>)
                  {   const httpOptions: any = {
                      headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${accesstoken}`
                   })
                   };
                   return  this.http.get(this.workdeskanalytics+"/private/plugin/users/unique?organization="+orgid+"&integration="+intid+"&time="+time+"&languages="+languages+"&countries="+countries,httpOptions)
                 }
                  // sessions
                  public   getUserCountsSession(accesstoken:string,orgid:string,intid:string,time:string,languages:Array<any>,countries:Array<any>,date_from:string,date_to:String)
                  {   const httpOptions: any = {
                      headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${accesstoken}`
                   })
                   };
                   return  this.http.get(this.workdeskanalytics+"/private/plugin/users/sessions?organization="+orgid+"&integration="+intid+"&time="+time+"&languages="+languages+"&countries="+countries+"&date_from="+date_from+"&date_to="+date_to,httpOptions)
                 }
                 /// get visitor counts for cards
                 public   getVisitorCountsTotal(accesstoken:string,orgid:string,intid:string,time:string,languages:Array<any>,countries:Array<any>)
                 {   const httpOptions: any = {
                     headers: new HttpHeaders({
                       'Content-Type': 'application/json',
                       'Accept': 'application/json',
                       'Authorization': `Bearer ${accesstoken}`
                  })
                  };
                  return  this.http.get(this.workdeskanalytics+"/private/plugin/visitors/total?organization="+orgid+"&integration="+intid+"&time="+time+"&languages="+languages+"&countries="+countries,httpOptions)
                }
                  // Unique
                  public   getVisitorCountsUnique(accesstoken:string,orgid:string,intid:string,time:string,languages:Array<any>,countries:Array<any>)
                  {   const httpOptions: any = {
                      headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${accesstoken}`
                   })
                   };
                   return  this.http.get(this.workdeskanalytics+"/private/plugin/visitors/unique?organization="+orgid+"&integration="+intid+"&time="+time+"&languages="+languages+"&countries="+countries,httpOptions)
                 }
                  // sessions
                  public   getVisitorCountsSession(accesstoken:string,orgid:string,intid:string,time:string,languages:Array<any>,countries:Array<any>,date_from:String,date_to:String)
                  {   const httpOptions: any = {
                      headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${accesstoken}`
                   })
                   };
                   return  this.http.get(this.workdeskanalytics+"/private/plugin/visitors/sessions?organization="+orgid+"&integration="+intid+"&time="+time+"&languages="+languages+"&countries="+countries+"&date_from="+date_from+"&date_to="+date_to,httpOptions)
                 }

}




