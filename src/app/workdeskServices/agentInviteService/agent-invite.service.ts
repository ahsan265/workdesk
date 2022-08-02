import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { CommonEndpoints } from 'src/app/commonEndpoints/commonEndpoint';
import { GigaaaApiService } from '../gigaaaApiService/gigaaa-api-service.service';

@Injectable({
  providedIn: 'root'
})
export class AgentInviteService {
  public agentInviteSubject = new Subject<boolean>();
  constructor(
    private GigaaaApiService: GigaaaApiService,
    private CommonEndpoints: CommonEndpoints,
    private router: ActivatedRoute
  ) {}

  public async sendtAgentInvitationCode() {
    let code = this.getInvitationCode();
    if (code != null) {
      let code_invite = { invitation_code: JSON.parse(code) };
      await this.GigaaaApiService.sendinvitationcode(
        this.CommonEndpoints.getEpsParamLocal().token,
        code_invite
      ).finally(() => {
        localStorage.removeItem('gigaaa-invitation');
      });
    }
  }

  public getInvitedAgentDetails() {
    this.router.queryParams.subscribe((data) => {
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
    });
  }
  private getInvitationCode() {
    return localStorage.getItem('gigaaa-invitation');
  }
}
