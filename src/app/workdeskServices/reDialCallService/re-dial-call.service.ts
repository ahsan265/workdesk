import { Injectable } from '@angular/core';
import { OverlayService } from 'src/app/callInterface/overLayService/overlay.service';
import { AgentUserInformation } from '../callInterfaceServices/agentUserInformation/agent-user-information.service';

@Injectable({
  providedIn: 'platform'
})
export class ReDialCallService {

  constructor(private AgentUserInformation: AgentUserInformation,
    private OverlayService: OverlayService,) {

    const callInformation = this.AgentUserInformation.getCallInformation();
    if (callInformation.is_refreshed === true) {
      this.OverlayService.open({
        data: callInformation['call-uuid']
      });
    }
  }
}
