/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { AgentSettings } from 'src/app/models/agentSettingsModel';
import { AgentList } from 'src/app/models/agentSocketModel';
import { InviteAgentModel } from 'src/app/models/agent';
import { inviteLinkModel } from 'src/app/models/invite';
@Injectable({
  providedIn: 'root'
})
export class GigaaaApiService {
  getagentdata$: Observable<any>;
  private agentdatasubject = new Subject<any>();
  protected API_URL = `${environment.apiUrl}`;
  protected oauthUrl = `${environment.oauth_url}`;

  private userapiUrl = `${environment.logged_user}`;
  private workdeskurl_cs = `${environment.prod_url_cs}`;
  private gigaabackendUlr = `${environment.prod_url_workdesk}`;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.getagentdata$ = this.agentdatasubject.asObservable().pipe();
  }
  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.authService.getLoggedUser()?.api_token}`
    });
  }
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.currentUser}`, {
      headers: this.getHeaders()
    });
  }

  public async updatePassword(
    access_token: string,
    passwordPayload: any,
    USER_ID: any
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      })
    };
    return await this.http
      .put(this.userapiUrl + `/users/${USER_ID}`, passwordPayload, httpOptions)
      .toPromise();
  }

  public getAllCountries(project: string, oranization: string): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.authService.getLoggedUser().api_token}`
      })
    };

    return this.http
      .get(this.workdeskurl_cs + '/private/countries?project=' + project + "&organization=" + oranization, httpOptions)
      .toPromise();
  }
  public getAllLanguages(): Promise<any> {
    const httpOptions: any = this.getHeaders();

    return this.http
      .get(
        this.gigaabackendUlr + '/statics/public/languages/officially-supported',
        httpOptions
      )
      .toPromise();
  }
  // get project languages

  public getProjectLanguages(
    access_token: string,
    organization: string,
    project: string
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`
      })
    };
    return this.http
      .get(
        this.workdeskurl_cs +
        '/private/agent/languages?organization=' +
        organization +
        '&project=' +
        project,
        httpOptions
      )
      .toPromise();
  }

  public forgotPassword(email: string) {
    const httpOptions: any = this.getHeaders();
    let body = { email };
    return this.http.post(
      `https://gigaaa-core.westeurope.cloudapp.azure.com/password/email`,
      body,
      httpOptions
    );
  }

  public async getOrganization(accesstoken: string) {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json,*/*',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return await this.http
      .get(
        this.workdeskurl_cs + '/private/organizations/last-used',
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }
  // not required now
  public getallagents(
    accesstoken: string,
    subsid: string,
    intid: string,
    show_active: number,
    show_invited: number,
    show_inactive: number,
    languages: any
  ) {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json,*/*',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return this.http.get(
      this.workdeskurl_cs +
      '/private/agents?show_active=' +
      show_active +
      '&show_invited=' +
      show_invited +
      '&show_inactive=' +
      show_inactive +
      '&languages=' +
      languages +
      '&organization=' +
      subsid +
      '&integration=' +
      intid,
      httpOptions
    );
  }

  // not in my use
  public getallstats(accesstoken: string, subsid: string, intid: string) {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json,*/*',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return this.http.get(
      this.workdeskurl_cs +
      '/statistics?subscription=' +
      subsid +
      '&integration=' +
      intid,
      httpOptions
    );
  }
  // not in my use
  public getalllistofqueueagent(
    accesstoken: string,
    orgid: string,
    intid: string
  ) {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };

    return this.http.get(
      this.workdeskurl_cs +
      'queue?organization=' +
      orgid +
      '&integration=' +
      intid +
      '&languages=',
      httpOptions
    );
  }
  // not in my use
  public getagentinforusingid(subsid: string, id: number) {
    const httpOptions: any = this.getHeaders();
    return this.http.get(
      this.workdeskurl_cs + '/queue/' + id + '?subscription=' + subsid,
      httpOptions
    );
  }
  public async getAllProject(token: string, uuid: string): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return this.http
      .get(
        this.workdeskurl_cs + '/private/projects?organization=' + uuid,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }
  public async updateLastUsediPorject(
    accesstoken: string,
    uuid: string,
    projectBody: any
  ) {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return await this.http
      .put(
        this.workdeskurl_cs + '/private/projects?organization=' + uuid,
        projectBody,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }
  // not in my use
  public async assignrole(
    accesstoken: string,
    subsid: string,
    addrole: any
  ): Promise<any> {
    const httpOptions: any = {
      method: 'POST',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return await this.http
      .post(
        this.workdeskurl_cs + '/agents?subscription=' + subsid,
        addrole,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  public async getcalltype(
    accesstoken: string,
    orguuid: string,
    intid: string,
    id: any
  ): Promise<any> {
    const httpOptions: any = {
      method: 'POST',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return await this.http
      .post(
        this.workdeskurl_cs +
        '/private/start-call?organization=' +
        orguuid +
        '&project=' +
        intid,
        id,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }
  //  logged in agent upload pic
  public uploaduserprofilepic(
    accesstoken: string,
    organization: string,
    project: string,
    file: File
  ) {
    const httpOptions: any = {
      method: 'POST',
      headers: new HttpHeaders({
        Authorization: `Bearer ${accesstoken}`
      }),
      reportProgress: true,
      observe: 'events'
    };
    const formdata = new FormData();
    formdata.append('image', file);
    return this.http.post(
      this.workdeskurl_cs +
      '/private/agents/image?organization=' +
      organization +
      '&project=' +
      project,
      formdata,
      httpOptions
    );
  }
  // agent upload pic by admin
  public agentuploaduserprofilepic(
    accesstoken: string,
    orgid: string,
    intgid: String,
    uuid: string,
    file: File
  ) {
    const httpOptions: any = {
      method: 'POST',
      headers: new HttpHeaders({
        Authorization: `Bearer ${accesstoken}`
      }),
      reportProgress: true,
      observe: 'events'
    };
    var formdata = new FormData();
    formdata.append('image', file);
    return this.http.post(
      this.workdeskurl_cs +
      '/private/agents/image?organization=' +
      orgid +
      '&project=' +
      intgid +
      '&agent=' +
      uuid,
      formdata,
      httpOptions
    );
  }
  // not in my use
  public async editagent(
    accesstoken: string,
    subsid: string,
    id: number,
    addrole: any
  ): Promise<any> {
    const httpOptions: any = {
      method: 'PUT',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return await this.http
      .put(
        this.workdeskurl_cs +
        '/customer-support/agents/' +
        id +
        '?subscription=' +
        subsid,
        addrole,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  //get visitors
  public async getvisitorlist(accesstoken: string, orgid: string, intid: string): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return await this.http.get(
      this.gigaabackendUlr +
      '/workdesk/visitors?organization=' +
      orgid +
      '&integration=' +
      intid,
      httpOptions
    ).toPromise()
      .catch((err) => {
        throw err;
      });
  }

  //get visitors
  public async getroleofagent(accesstoken: string, orgid: string, intid: string): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return this.http.get(
      this.workdeskurl_cs +
      '/private/is-admin?organization=' +
      orgid +
      '&project=' +
      intid,
      httpOptions
    ).toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // get token for agents socket api
  public getsockettoken(accesstoken: string, orgid: string, intid: string) {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return this.http.get(
      this.workdeskurl_cs +
      'queue/websocket/access-token?organization=' +
      orgid +
      '&integration=' +
      intid,
      httpOptions
    );
  }

  // invite agent endpoint

  public async getinviteagent(
    accesstoken: string,
    uuid: string,
    project: string,
    agentdata: InviteAgentModel[]
  ): Promise<any> {
    const httpOptions: any = {
      method: 'POST',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return await this.http
      .post(
        this.workdeskurl_cs +
        '/private/v2/invitation?organization=' +
        uuid +
        '&project=' +
        project,
        agentdata,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  //post refeeral code for agents invited
  public async sendinvitationcode(
    accesstoken: string,
    agentdata: any
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return await this.http
      .put(
        this.workdeskurl_cs + '/private/invitation/accept?code',
        agentdata,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // delete agents
  public async deleteagent(
    accesstoken: string,
    orgid: string,
    intid: string,
    agentuuid: any
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return this.http
      .delete(
        this.workdeskurl_cs +
        '/private/agents/' +
        agentuuid +
        '?organization=' +
        orgid +
        '&project=' +
        intid,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // get agent online status
  public getagentonlinestatus(
    accesstoken: string,
    orgid: string,
    intid: string
  ) {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return this.http.get(
      this.workdeskurl_cs +
      '/private/is-online?organization=' +
      orgid +
      '&integration=' +
      intid,
      httpOptions
    );
  }
  // set online status
  public async putonlinestatus(
    accesstoken: string,
    orgid: string,
    intid: string,
    online: any
  ): Promise<any> {
    const httpOptions: any = {
      method: 'POST',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return await this.http
      .put(
        this.workdeskurl_cs +
        '/private/is-online?organization=' +
        orgid +
        '&integration=' +
        intid,
        online,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // resend invitation
  public async resendInvitation(
    accesstoken: string,
    orgid: string,
    intid: string,
    agentuuid: any
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return await this.http
      .post(
        this.workdeskurl_cs +
        '/private/invitation/resend?agent=' +
        agentuuid +
        '&organization=' +
        orgid +
        '&project=' +
        intid,
        {},
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // update agent settings

  public async updateAgentSettings(
    token: string,
    organizationId: string,
    projectId: string,
    agentUuid: string,
    agentBody: AgentSettings
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return await this.http
      .put(
        this.workdeskurl_cs +
        '/private/agents/' +
        agentUuid +
        '?organization=' +
        organizationId +
        '&project=' +
        projectId,
        agentBody,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // get invitation status
  public getinvitationdetails(code: string): any {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json'
      })
    };
    return this.http.get(
      this.workdeskurl_cs + '/public/invitation?code=' + code,
      httpOptions
    );
  }

  // get loggedin agent uuid
  public async getloggedinagentuuid(
    accesstoken: string,
    orgid: string,
    intid: string
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };

    return await this.http
      .get(
        this.workdeskurl_cs +
        '/private-project/agent?organization=' +
        orgid +
        '&project=' +
        intid,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  public async getConnectionId(
    token: string,
    organizationId: string,
    projectId: string
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return await this.http
      .get(
        `${this.workdeskurl_cs}/private/organization/${organizationId}/project/${projectId}/connection`,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  public getSelectedAgentData(
    token: string,
    organizationId: string,
    projectId: string,
    agentUuid: string
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return this.http
      .get<any>(
        `${this.workdeskurl_cs}/private/agent-full?organization=${organizationId}&project=${projectId}&agent=${agentUuid}`,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // set all language selected

  public async setAllLanguageEnabled(
    token: string,
    agentUuid: string,
    organizationId: string,
    projectId: string,
    languageBody: any
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return await this.http
      .put(
        this.workdeskurl_cs +
        '/private/agent/all-languages/' +
        agentUuid +
        '?organization=' +
        organizationId +
        '&project=' +
        projectId,
        languageBody,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }


  public async setLastUsedOrganization(
    token: string,
    organizationId: string,
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return await this.http
      .put(
        this.workdeskurl_cs +
        '/private/organization/' +
        organizationId +
        '/last-used',
        {},
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // remove agent image endpoint
  public async deleteAgentImage(
    accesstoken: string,
    orgid: string,
    intid: string,
    agentUuid: string
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return this.http
      .delete(
        this.workdeskurl_cs +
        '/private/agents/image?organization=' +
        orgid +
        '&project=' +
        intid +
        '&agent=' +
        agentUuid,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // set active agent when agent is disbaled by cs on console. 

  public async setInavtiveAgentToActive(
    token: string,
    uuid: string,
    organizationId: string,
    projectId: string,
    inactive: boolean
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return await this.http
      .put(
        this.workdeskurl_cs +
        '/private/agents/' +
        uuid +
        '/deactivate?organization=' + organizationId + '&project=' + projectId,
        { "inactive": inactive },
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }
  // for join chat 
  public async setChatAnswer(
    accesstoken: string,
    orguuid: string,
    intid: string,
    id: any
  ): Promise<any> {
    const httpOptions: any = {
      method: 'POST',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return await this.http
      .post(
        this.workdeskurl_cs +
        '/private/organization/' +
        orguuid +
        '/project/' +
        intid + '/chat/answer',
        id,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // for end chat 
  public async setChatEnd(
    accesstoken: string,
    orguuid: string,
    intid: string,
    id: any
  ): Promise<any> {
    const httpOptions: any = {
      method: 'POST',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return await this.http
      .post(
        this.workdeskurl_cs +
        '/private/organization/' +
        orguuid +
        '/project/' +
        intid + '/chat/end',
        id,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  public async updateUnreadMessage(
    token: string,
    organizationId: string,
    projectId: string,
    c_uuid: string,
    messageUuid: number[]
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return await this.http
      .put(
        this.workdeskurl_cs +
        '/private/organization/' + organizationId + '/project/' + projectId + '/conversation/' + c_uuid,
        { messages: messageUuid },
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // table customization  update 

  public async tableCustomization(
    token: string,
    organizationId: string,
    projectId: string,
    customization_id: number,
    customization_value: string,
    table_identifier: string
  ): Promise<any> {
    const httpOptions: any = {
      method: 'POST',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return await this.http
      .post(
        this.workdeskurl_cs +
        '/private/organization/' + organizationId + '/project/' + projectId + '/table-customization',
        {
          customization_id: customization_id,
          customization_value: customization_value,
          table_identifier: table_identifier
        },
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // table customization  list 

  public async tableCustomizationList(
    token: string,
    organizationId: string,
    projectId: string,
    table_identifier: string,
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return await this.http
      .get(
        this.workdeskurl_cs +
        '/private/organization/' + organizationId + '/project/' + projectId + '/table-customization?table_identifier=' + table_identifier,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // get default requests time 
  public async getDefaultRequestTime(
    token: string,
    organizationId: string,
    projectId: string,
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return await this.http
      .get(
        this.workdeskurl_cs +
        '/private/organization/' + organizationId + '/project/' + projectId + '/settings',
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }
  // set Request 
  public async setDefaultRequestTime(
    token: string,
    organizationId: string,
    projectId: string,
    call_wait_time: number,
    user_wait_time: number,
    chat_wait_time: number
  ): Promise<any> {
    const httpOptions: any = {
      method: 'POST',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return await this.http
      .post(
        this.workdeskurl_cs +
        '/private/organization/' + organizationId + '/project/' + projectId + '/settings',
        {
          call_wait_time: call_wait_time,
          user_wait_time: user_wait_time,
          chat_wait_time: chat_wait_time
        },
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }


  // get All Notification
  public async getAllNotification(
    token: string,
    organizationId: string,
    projectId: string,
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return await this.http
      .get(
        this.workdeskurl_cs +
        '/private/organization/' + organizationId + '/project/' + projectId + '/notifications',
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // delete notification 
  // delete agents
  public async deletNotification(
    accesstoken: string,
    organizationId: string,
    projectId: string,
    notificationId: any
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accesstoken}`
      })
    };
    return this.http
      .delete(
        this.workdeskurl_cs +
        '/private/organization/' + organizationId + '/project/' + projectId + '/notifications?ids=' + notificationId,
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }

  // set unread to read notification 
  public async setUnreadToreadNotification(
    token: string,
    organizationId: string,
    projectId: string,
    id: number,
  ): Promise<any> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
    return await this.http
      .put(
        this.workdeskurl_cs +
        '/private/organization/' + organizationId + '/project/' + projectId + '/notification/' + id + '/read ',
        {

        },
        httpOptions
      )
      .toPromise()
      .catch((err) => {
        throw err;
      });
  }
}
