import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentService } from 'src/app/agents/agentService/agent.service';
import { InviteAgentModel } from 'src/app/models/agent';
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
  email: string[] = new Array();
  languages = languauges;
  arrayOfLanguages: MultiSelect[] = new Array();

  agentListingCounter: number = 1;
  @ViewChildren('email') emailLists!: QueryList<ElementRef>;
  langaugeIds: number[] = new Array();
  constructor(
    private CommonService: CommonService,
    private formBuilder: FormBuilder,
    private AgentService: AgentService,
    private MessageService: MessageService,
    private SharedServices: SharedServices
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
    this.arrayOfLanguages.push(this.languages);
    this.langaugeIds[0] = 0;
    this.email.push('');
  }

  languaugesOutput(event: number, indexValue: number) {
    this.langaugeIds[indexValue] = event;
  }
  // add new listing for invitation of agent
  async addAgentListing() {
    const languages = await this.CommonService.getProjectLanguages();
    this.agentListingCounter++;
    this.arrayOfLanguages.push(languages);
    this.langaugeIds[this.agentListingCounter - 1] = 0;
    this.email.push('');
  }
  // remove agent from listing
  removeAgentFromListing(indexValue: number) {
    this.agentListingCounter--;
    this.arrayOfLanguages.splice(indexValue, 1);
    this.langaugeIds.splice(indexValue, 1);
    this.email.splice(indexValue, 1);
  }
  // get dynamically update list of Agents to be added
  getListingAgents() {
    return Array(this.agentListingCounter);
  }

  public async getListedAgentDetails(): Promise<boolean> {
    let isAllDataOk: boolean = false;
    this.email.forEach(async (data, i) => {
      if (data !== '' && this.langaugeIds[i] != 0) {
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
      this.email.forEach(async (data, i) => {
        let agentListedData: InviteAgentModel = {
          email: this.email[i],
          role: 'agent',
          language_ids: this.langaugeIds[i]
        };
        await this.AgentService.validateAgent(agentListedData);
        this.SharedServices.closeAddAgentPopup(true);
      });
    } else {
      this.MessageService.setErrorMessage('Please enter valid information');
    }
  }

  // get email
  getEmailByIndex(indexValue: number) {
    let pattern = '^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$';
    this.email[indexValue] =
      this.emailLists.get(indexValue)?.nativeElement.value;
  }

}
