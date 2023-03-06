import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayService } from '@gigaaa/gigaaa-components';
import { AgentService } from 'src/app/agents/agentService/agent.service';
import { agentInvitationList, InviteAgentModel } from 'src/app/models/agent';
import { OneSelect } from 'src/app/models/oneSelect';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { MessageService } from 'src/app/workdeskServices/messageService/message.service';
import { SharedServices } from 'src/app/workdeskServices/sharedResourcesService/shared-resource-service.service';
import { AgentSocketService } from 'src/app/workdeskSockets/agentSocket/agent-socket.service';
import { freeSeats } from 'src/app/workdeskSockets/agentSocket/agentSocketData';
import { languauges } from '../addAgentData';

@Component({
  selector: 'app-agent-listing',
  templateUrl: './agent-listing.component.html',
  styleUrls: ['./agent-listing.component.scss']
})
export class AgentListingComponent implements OnInit {
  email: string = '';
  typedEmail: string = '';

  languages = languauges;
  agentIvitationList: agentInvitationList[] = [];
  agentListingCounter: number = 1;
  @ViewChildren('email') emailTyped!: QueryList<ElementRef>;
  @ViewChild('email', { static: true }) emailEntered!: ElementRef;
  freeSeatCount!: number;
  isValidEmail: boolean = false;

  langaugeIds: number[] = [];
  constructor(
    private CommonService: CommonService,
    private formBuilder: FormBuilder,
    private AgentService: AgentService,
    private MessageService: MessageService,
    private overlayService: OverlayService,
    private AgentSocketService: AgentSocketService
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
    this.AgentSocketService.freeSeatsInformation.asObservable().subscribe(data => {
      this.freeSeatCount = data.count;
    });

  }

  languaugesOutput(event: number[]) {
    this.langaugeIds = event;
  }
  // add new listing for invitation of agent
  async addAgentListing() {
    if (this.agentIvitationList.length !== this.freeSeatCount) {
      if (this.isValidEmail === true && this.langaugeIds.length !== 0) {
        this.agentIvitationList.push({ email: this.email, language: this.langaugeIds });
        this.languages.data.forEach(language => {
          language.selected = false;
        })
        this.typedEmail = '';
        this.isValidEmail = false;
        this.langaugeIds = [];
      }
      else {
        this.MessageService.setErrorMessage('Please enter valid information');
      }

    }
    else {
      this.MessageService.setErrorMessage('No more available seats. ');
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
   
        const agentListedData: InviteAgentModel[] = this.agentIvitationList.map((data) => ({
          email: data.email,
          role: 'agent',
          language_ids: data.language
        }))
        await this.AgentService.sendInvitationToAgent(agentListedData);
      this.MessageService.setSuccessMessage('Agent invitation(s) has been sent.');
      this.overlayService.close();

    } else {
      this.MessageService.setErrorMessage('Please fill all fields.');
    }
  }

  // get email
  getEmailByIndex() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.emailTyped.get(0)?.nativeElement.value)) {
      this.email = this.emailTyped.get(0)?.nativeElement.value;
      this.isValidEmail = true;
    }
    else {
      this.isValidEmail = false;
    }
  }

}
