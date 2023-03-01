import { Component, Inject, Input, OnInit } from '@angular/core';
import { component_data, OverlayService } from '@gigaaa/gigaaa-components';
import { AgentSettingService } from 'src/app/agent-settings/agentSettingService/agent-setting.service';
import { AgentList } from 'src/app/models/agentSocketModel';
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
    private MessageService: MessageService,
    private AgentSettingService: AgentSettingService,
    @Inject(component_data) public data: any,
    private OverlayService: OverlayService

  ) {
    this.agentData = data;
  }

  ngOnInit(): void { }

  public async deleteAgent(): Promise<void> {
    try {
      await this.AgentSettingService.deleteAgent(this.agentData?.uuid, 'Agent deleted successfully.');
      this.OverlayService.close();
    } catch (err: any) {
      this.MessageService.setErrorMessage(err.error.error);
    }
  }
  // close popup
  closePopup() {
    this.OverlayService.close()
  }
}
