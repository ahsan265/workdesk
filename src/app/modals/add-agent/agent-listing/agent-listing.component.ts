import {
  Component,
  ElementRef,
  OnInit,
  Query,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OverlayService } from '@gigaaa/gigaaa-components';
import { AgentService } from 'src/app/agents/agentService/agent.service';
import { agentInvitationList, InviteAgentModel } from 'src/app/models/agent';
import { MultiSelect } from 'src/app/models/multiSelect';
import { OneSelect } from 'src/app/models/oneSelect';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';
import { SharedServices } from 'src/app/workdeskServices/sharedResourcesService/shared-resource-service.service';
import { languauges } from '../addAgentData';

@Component({
  selector: 'app-agent-listing',
  templateUrl: './agent-listing.component.html',
  styleUrls: ['./agent-listing.component.scss']
})
export class AgentListingComponent implements OnInit {
  email: string = '';
  languages = languauges;
  agentIvitationList: agentInvitationList[] = [];
  agentListingCounter: number = 1;
  @ViewChildren('email') emailTyped!: QueryList<ElementRef>;

  langaugeIds: number[] = [];
  constructor(
    private CommonService: CommonService,
    private formBuilder: FormBuilder,
    private AgentService: AgentService,
    private MessageService: MessageService,
    private SharedServices: SharedServices,
    private overlayService: OverlayService
  ) { }
  form: FormGroup = this.formBuilder.group({
    agentListing: this.formBuilder.array([])
  });

  async ngOnInit(): Promise<void> {
    const languages = await this.CommonService.getProjectLanguages();
    this.languages.data = languages.data.map((data: OneSelect) => ({
      id: data.id,
      name: data.name,
      selected: false
    }));

  }

  languaugesOutput(event: number[]) {
    this.langaugeIds = event;
  }
  // add new listing for invitation of agent
  async addAgentListing() {
    if (this.email !== '' && this.langaugeIds.length !== 0) {
      this.agentIvitationList.push({ email: this.email, language: this.langaugeIds });
      this.languages.data.forEach(language => {
        language.selected = false;
      })
      this.email = '';
      this.langaugeIds=[];
      // this.AgentService.getLanguageFlagById(AgentList.languages)
    }
    else {
      this.MessageService.setErrorMessage('Please enter valid information');
    }
  }
  // remove agent from listing
  removeAgentFromListing(indexValue: number) {
    this.agentIvitationList.splice(indexValue, 1);
  }
  // get aent languages flag 
  getAgentLanguageFlag(id: number) {
    return this.CommonService.getLanguageFlags(id);
  }

  public async getListedAgentDetails(): Promise<boolean> {
    let isAllDataOk: boolean = false;
    this.agentIvitationList.forEach(async (data, i) => {
      if (data.email !== '' && data.language.length !== 0) {
        isAllDataOk = true;
      } else {
        isAllDataOk = false;
      }
    });
    return isAllDataOk;
  }

  async sendAgentInformation() {
    const isAllDataOk: boolean = await this.getListedAgentDetails();
    if (isAllDataOk) {
      this.agentIvitationList.forEach(async (data) => {
        let agentListedData: InviteAgentModel = {
          email: data.email,
          role: 'agent',
          language_ids: data.language
        };
        await this.AgentService.sendInvitationToAgent(agentListedData);
      });
      this.MessageService.setSuccessMessage('Agent invitation(s) has been sent.');
      this.overlayService.close();

    } else {
      this.MessageService.setErrorMessage('Please enter valid information');
    }
  }

  // get email
  getEmailByIndex() {
    this.email = this.emailTyped.get(0)?.nativeElement.value;
  }

}
