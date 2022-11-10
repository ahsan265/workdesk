import { Component, Input, OnInit } from '@angular/core';
import { AgentSettingService } from 'src/app/agent-settings/agentSettingService/agent-setting.service';
import { AgentList } from 'src/app/models/agentSocketModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';
import { SharedServices } from 'src/app/workdeskServices/sharedResourcesService/shared-resource-service.service';

@Component({
  selector: 'app-delete-agent',
  templateUrl: './delete-agent.component.html',
  styleUrls: ['./delete-agent.component.scss']
})
export class DeleteAgentComponent implements OnInit {
  @Input()
  agentData!: AgentList;
  constructor(
    private SharedServices: SharedServices,
    private GigaaaApiService: GigaaaApiService,
    private MessageService: MessageService,
    private AgentSettingService: AgentSettingService,
    private CommonService: CommonService
  ) { }

  ngOnInit(): void { }

  public async deleteAgent(): Promise<void> {
    try {
      await this.AgentSettingService.deleteAgent(this.agentData?.uuid, 'Agent deleted successfully.');
      this.SharedServices.closePasswordPopup(true);
    } catch (err: any) {
      this.MessageService.setErrorMessage(err.error.error);
    }
  }

  // close popup

  closePopup() {
    this.SharedServices.closePasswordPopup(true);
  }
}
