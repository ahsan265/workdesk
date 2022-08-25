import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { CommonService } from '../commonEndpoint/common.service';
import { GigaaaApiService } from '../gigaaaApiService/gigaaa-api-service.service';
import { MessageService } from '../messageService/message.service';

@Injectable({
  providedIn: 'root'
})
export class AgentInviteService {
  public agentInviteSubject = new Subject<boolean>();
  constructor(
    private GigaaaApiService: GigaaaApiService,
    private CommonService: CommonService,
    private router: ActivatedRoute,
    private MessageService: MessageService
  ) {}

  public async sendtAgentInvitationCode() {
    let code = this.getInvitationCode();
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
          this.MessageService.setErrorMessage(err.error.error);
        });
    }
  }

  public getInvitedAgentDetails() {
    this.router.queryParams.subscribe(
      (data) => {
        let code = data['invitation_code'];
        if (code != null) {
          localStorage.setItem('gigaaa-invitation', JSON.stringify(code));
          this.GigaaaApiService.getinvitationdetails(code).subscribe(
            (data: any) => {
              if (data != null) {
                if (data['already_used'] !== false) {
                  localStorage.removeItem('gigaaa-invitation');
                  this.agentInviteSubject.next(true);
                }
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
