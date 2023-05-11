/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { connectionSecurityModel } from 'src/app/models/connectionSecurity';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { SharedServices } from 'src/app/workdeskServices/sharedResourcesService/shared-resource-service.service';
import { AgentSocketService } from '../agentSocket/agent-socket.service';
import { AnalyticsSocketService } from '../analyticsSocket/analytics-socket.service';
import { ChatSocketService } from '../chatSocket/chat-socket.service';
import { QueueSocketService } from '../queueSocket/queue-socket.service';
import { GeneralSocketService } from '../generalSocket/general-socket.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionSecurityService {
  constructor(
    private gigaaaApiService: GigaaaApiService,
    private AgentSocketService: AgentSocketService,
    private QueueSocketService: QueueSocketService,
    private AnalyticsSocketService: AnalyticsSocketService,
    private ChatSocketService: ChatSocketService,
    private CommonService: CommonService,
    private SharedServices: SharedServices,
    private GeneralSocketService: GeneralSocketService
  ) { }
  public async createConnectionEndpoint(
    token: string,
    ogranizationId: string,
    projectId: string
  ) {
    const connection: connectionSecurityModel =
      await this.gigaaaApiService.getConnectionId(
        token,
        ogranizationId,
        projectId
      );
    localStorage.setItem('connection-id', JSON.stringify(connection));
    await this.CommonService.getAgentRole();
    this.AgentSocketService.closeAgentSocketConnection();
    this.QueueSocketService.closeQueueSocketConnection();
    this.AnalyticsSocketService.closeAnalyticsSocketConnection();
    this.ChatSocketService.closeChatSocket();
    this.GeneralSocketService.closeSocket();
    this.AnalyticsSocketService.callAnalyticsSocketEndpoint();
    this.AgentSocketService.callAgentSocketEndpoint();
    this.QueueSocketService.callQueueSocketEndpoint();
    this.ChatSocketService.startChat();
    this.GeneralSocketService.startGeneralSocket();
    this.SharedServices.loadCommonEps(1);
  }
}
