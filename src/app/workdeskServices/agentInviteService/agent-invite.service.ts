import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { inviteLinkModel } from 'src/app/models/invite';
import { CommonService } from '../commonEndpoint/common.service';
import { GigaaaApiService } from '../gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from '../messageService/message.service';

@Injectable({
  providedIn: 'root'
})
export class AgentInviteService {
  public agentInviteSubject = new Subject<inviteLinkModel>();
  public agentNonComplientAccountSubject = new Subject<boolean>();
  constructor(
    private GigaaaApiService: GigaaaApiService,
    private CommonService: CommonService,
    private ActivatedRoute: ActivatedRoute,
    private MessageService: MessageService,
    private Router: Router,
  ) { }

  public async sendtAgentInvitationCode() {
    let code = this.getInvitationCode();
    console.log(code)
    if (code != null) {
      let code_invite = { invitation_code: JSON.parse(code) };
      await this.GigaaaApiService.sendinvitationcode(
        this.CommonService.getEndpointsParamLocal().token,
        code_invite
      )
        .finally(() => {
          localStorage.removeItem('gigaaa-invitation');
        })
        .catch((err: any) => {
          this.Router.navigate(['logout']);
          this.agentNonComplientAccountSubject.next(true);
          this.MessageService.setErrorMessage(err.error.error);

        });
    }
  }

  public getInvitedAgentDetails() {
    this.ActivatedRoute.queryParams.subscribe(
      (data) => {
        let code = data['invitation_code'];
        if (code != null) {
          localStorage.setItem('gigaaa-invitation', JSON.stringify(code));
          this.GigaaaApiService.getinvitationdetails(code).subscribe(
            (data: inviteLinkModel) => {
              console.log(data)
              if (data != null) {
                // localStorage.removeItem('gigaaa-invitation');
                this.agentInviteSubject.next(data);
              }
            }
          );
        }
      },
      (err: any) => {
        this.MessageService.setErrorMessage(err.error.error);
      }
    );
  }
  private getInvitationCode() {
    return localStorage.getItem('gigaaa-invitation');
  }
}
