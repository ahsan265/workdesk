import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output
} from '@angular/core';
import { AgentUserInformation } from 'src/app/workdeskServices/callInterfaceServices/agentUserInformation/agent-user-information.service';

@Directive({
  selector: '[miniCameraVideoStream]'
})
export class peerMiniCameraAnimation {
  isAnimated: boolean = false;

  @HostBinding('style.transform') private transform = 'translatex(0px)';
  constructor(private AgentUserInformation: AgentUserInformation) {}
  @HostListener('document:click', ['$event']) public onStop(evt: any) {
    const user = this.AgentUserInformation.getCallInformation();
    if (user.peer_information?.data?.isScreenShareOn === true) {
      let timeout;
      if (this.isAnimated === false) {
        evt.preventDefault();
        evt.stopPropagation();
        clearTimeout(timeout);
        this.transform = 'translatex(-500px)';
        this.isAnimated = true;
      } else if (this.isAnimated === true) {
        timeout = setTimeout(() => {
          this.transform = 'translatex(0px)';
          this.isAnimated = false;
        }, 500);
      }
    } else {
      this.transform = 'translatex(0px)';
    }
  }
}
