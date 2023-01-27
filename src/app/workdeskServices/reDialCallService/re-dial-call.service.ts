import { Injectable } from '@angular/core';
import { OverlayService } from '@gigaaa/gigaaa-components';
import { CallConsoleComponent } from 'src/app/callInterface/call-console/call-console.component';
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
        component: CallConsoleComponent,
        data: callInformation['call-uuid'],
        panelClass: 'dialog-panel',
        isPopup: false
      });
    }
  }
}
