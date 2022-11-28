/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  AgentAction,
  AgentList,
  AgentOnlineOrNot,
  AgentOnlineStatus,
  AgentParameter
} from 'src/app/models/agentSocketModel';
import { connectionSecurityModel } from 'src/app/models/connectionSecurity';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { environment } from 'src/environments/environment';
import { agentLoggedData } from './agentSocketData';

@Injectable({
  providedIn: 'root'
})
export class AgentSocketService {
  lastUsedParameter: AgentParameter = {};
  protected websocket_url = `${environment.websocket_url}`;
  ws: WebSocket | undefined;
  isSocketOpen: any;
  public AgentLiveStatus = new Subject<boolean>();
  public AgentListSubject = new Subject<AgentList[]>();
  isOganizationAdminStatus: boolean = false;
  isUserAgentOrAdmin: string = '';
  isInCall: boolean = false;
  public isInCallValue: BehaviorSubject<boolean>;

  constructor(private CommonService: CommonService, private Router: Router) {
    this.isInCallValue = new BehaviorSubject(this.isInCall);
  }

  public callAgentSocketEndpoint() {
    const connectionId: connectionSecurityModel = JSON.parse(
      localStorage.getItem('connection-id') || '{}'
    );
    let url =
      this.websocket_url + '/agents?connection=' + connectionId.connection;
    this.socketStates(url);
  }
  private socketStates(url: string) {
    this.ws = new WebSocket(url);
    // on socket connection open
    this.ws.onopen = (e) => {
      this.isSocketOpen = this.ws?.OPEN;
      this.sendAgentsParameter({
        active: 1,
        inactive: 1,
        invited: 1,
        languages: []
      });
    };
    this.ws.onmessage = (e) => {
      switch (e.data) {
        case '{"action":"logout"}':
          this.Router.navigate(['logout']);
          break;
        default:
      }
      e.data !== 'ping' ? this.getAgentList(JSON.parse(e.data)) : '';
    };
    this.ws.onclose = (e) => { };
    this.ws.onerror = (e) => { };
  }
  public sendAgentsParameter(AgentParameter: AgentParameter) {
    if (this.isSocketOpen === 1) {
      this.lastUsedParameter = AgentParameter;
      const agentParameters: AgentAction = {
        action: 'filter',
        data: AgentParameter
      };
      const agentParameterObject = JSON.stringify(agentParameters);
      this.ws?.send(agentParameterObject);
    }
  }
  private getAgentList(AgentList: AgentList[]) {
    this.CommonService.getIsAdminOrAgent();
    this.AgentListSubject.next(AgentList);
    this.getAgentOnlineStatus(AgentList);
 
  }
  private getAgentOnlineStatus(AgentList: AgentList[]) {
    const user = JSON.parse(localStorage.getItem('gigaaa-user') || '{}');
    const loggedInAgent = AgentList.find(
      (agent: AgentList) => agent.email === user.email
    );
    this.isInCall=loggedInAgent?.is_in_call||false;

    loggedInAgent?.is_organization_admin === true
      ? (this.isOganizationAdminStatus = true)
      : (this.isOganizationAdminStatus = false);
    loggedInAgent?.role === 'Admin'
      ? (this.isUserAgentOrAdmin = 'Admin')
      : (this.isUserAgentOrAdmin = 'Agent');
    loggedInAgent?.is_available === true && loggedInAgent?.is_online === true
      ? this.sendAgentOnlineStatus(true)
      : this.sendAgentOnlineStatus(false);
    loggedInAgent?.is_in_call === true
      ? (this.isInCall = true)
      : (this.isInCall = false);
  }
  public setAgentOnlineStatus(isOnline: boolean) {
    const isAgentOnline: AgentOnlineStatus = {
      action: 'is_available',
      value: isOnline
    };
    const AgentOnlineParameter: AgentOnlineOrNot = {
      action: 'update_status',
      data: isAgentOnline
    };
    const AgentOnlineObject = JSON.stringify(AgentOnlineParameter);
    this.ws?.send(AgentOnlineObject);
  }

  // online status of agent
  private sendAgentOnlineStatus(isOnline: boolean) {
    this.AgentLiveStatus.next(isOnline);
    localStorage.setItem('agent-online-status', JSON.stringify(isOnline));
  }
  // set organization Admin or not
  public getOrganizationAdminStatus() {
    return {
      is_organization_admin: this.isOganizationAdminStatus,
      role: this.isUserAgentOrAdmin
    };
  }
  // get last used parameters
  public getLastUsedParams() {
    if (this.lastUsedParameter != '{}') {
      this.sendAgentsParameter(this.lastUsedParameter);
    }
  }
  // close the agent socket Connnection
  public closeAgentSocketConnection() {
    if (this.ws?.OPEN == this.isSocketOpen) {
      this.ws?.close();
    }
  }


}
