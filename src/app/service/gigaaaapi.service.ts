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

  private apiUrl = 'https://api.gconsole.io/v1/v1/';
  private authurl='https://api.gigaaa.link/oauth/token';
  private subsidurl='https://api.gconsole.io/cs';
  private workdeskurl_cs=`${environment.prod_url_cs}`;
  private gigaabackendUlr=`${environment.prod_url_workdesk}`
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

public getAllUsers(): Observable<any> {
  return this.http.get<any>(`${this.oauthUrl}/accounts`, {
    headers: this.getHeaders(),
  });
}

//

  public async loginUser(loginCredentials: LoginCredentials): Promise<any> {
    const apiUrl = this.apiUrl + 'auth/login';
    return await this.http.post(apiUrl, loginCredentials, this.httpOptions).toPromise()
      .catch((err) => {
        throw (err);
      });
  }

  public async registerUser(userData: UserData) {
    const apiUrl = this.apiUrl + 'auth/signup';
    return await this.http.post(apiUrl, userData, this.httpOptions).toPromise()
      .catch((err) => {
        throw (err);
      });
  }

  public async updateUsername(user: User): Promise<any> {
    const apiUrl = `${this.apiUrl}users/${user.id}`;
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${user.api_token}`
      })
    };
    return await this.http.put(apiUrl, { name: user.name }, httpOptions).toPromise();
  }

  public async updateUserProfile(user: User, data: {profile: Profile}): Promise<any> {
    const apiUrl = `${this.apiUrl}users/${user.id}`;
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${user.api_token}`
      })
    };
    return await this.http.put(apiUrl, data, httpOptions).toPromise();
  }

  public async updatePassword(access_token: string, passwordPayload: any): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
      })
    };
    return await this.http.post(this.gigaabackendUlr+"/users/password", passwordPayload, httpOptions).toPromise();
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

  public uploadImage(user: User, file: File): Promise<any> {
    const httpOptions: any = {
      method: 'POST',
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${user.api_token}`
      })
    };
    const formData: FormData = new FormData();
    formData.append('avatar', file);
    return this.http.post(this.apiUrl + `users/${user.id}/avatars`, formData, httpOptions).toPromise();
  }

  public getUserById(user: User, id:number) {
    const httpOptions: any = {
      method: 'GET',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${user.api_token}`
      })
    };
    return this.http.get(this.apiUrl + `users/${id}`, httpOptions).toPromise()
  }
 public  async getsubstoken(subsdata: subsdata): Promise<any>
 {
  const apiUrl = this.authurl;
  return await this.http.post(apiUrl,subsdata).toPromise()
    .catch((err) => {
      throw (err);
    });

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
     const apiUrl = this.subsidurl;
     return  this.http.get(apiUrl+"/statistics?subscription="+subsid+"&integration="+intid,httpOptions)

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
       const apiUrl = this.subsidurl;
       return  this.http.get(apiUrl+"/queue/"+id+"?subscription="+subsid,httpOptions)

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
    const apiUrl = this.subsidurl;
    return await this.http.post(apiUrl+"/agents?subscription="+subsid,addrole,httpOptions).toPromise()
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
    const apiUrl = this.subsidurl;
    return await this.http.put(this.workdeskurl_cs+"/customer-support/agents/"+id+"?subscription="+subsid,addrole,httpOptions).toPromise()
      .catch((err) => {
        throw (err);
      });
    }
    public  async updateagentdisplayname(accesstoken:string,subsid:string,intid:string,id:number,displayname:any): Promise<any>
    {   const httpOptions: any = {
         headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accesstoken}`
      })
    };
     const apiUrl = this.subsidurl;
     return await this.http.put(apiUrl+"/agents/"+id+"/name?subscription="+subsid+"&integration="+intid,displayname,httpOptions).toPromise()
       .catch((err) => {
         throw (err);
       });
     }
     public   getagentdislayname(accesstoken:string,subsid:string,intid:string)
     {   const httpOptions: any = {

          headers: new HttpHeaders({
         'Content-Type': 'application/json',
         'Accept': 'application/json',
         'Authorization': `Bearer ${accesstoken}`
       })
     };
      const apiUrl = this.subsidurl;
      return  this.http.get(apiUrl+"/agent?subscription="+subsid+"&integration="+intid,httpOptions)
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
                public   getcallstatistics(accesstoken:string,orgid:string,intid:string)
                {   const httpOptions: any = {
                    headers: new HttpHeaders({
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'Authorization': `Bearer ${accesstoken}`
                 })
                 };
                return  this.http.get(this.workdeskurl_cs+"/private/analytics/counts?organization="+orgid+"&integration="+intid,httpOptions)
              }

                 // get call chart
                 public   getcallchart(accesstoken:string,orgid:string,intid:string,time:string,languages:Array<any>,countries:Array<any>)
                 {  
                   const httpOptions: any = {
                     headers: new HttpHeaders({
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'Authorization': `Bearer ${accesstoken}`
                  })
                  };

                 return  this.http.get(this.workdeskurl_cs+"/private/analytics/aggregates?organization="+orgid+"&integration="+intid+"&time="+time+"&languages="+languages+"&countries="+countries,httpOptions)
                 }

                  // get call chart
                  public   getusers_and_visitors_chart(accesstoken:string,orgid:string,intid:string,date_from:string,date_to:string,languages:any,countries:any)
                  { 
                    const httpOptions: any = {
                      headers: new HttpHeaders({
                       'Content-Type': 'application/json',
                       'Accept': 'application/json',
                       'Authorization': `Bearer ${accesstoken}`
                   })
                   };
 
                  return  this.http.get(this.gigaabackendUlr+"/organization/analytics/users/visitors?organization="+orgid+"&integration="+intid+"&date_from="+date_from+"&date_to="+date_to+"&languages="+languages+"&countries="+countries,httpOptions)
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
}




