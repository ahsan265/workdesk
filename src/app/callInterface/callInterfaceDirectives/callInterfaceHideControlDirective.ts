import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { AgentUserInformation } from 'src/app/workdeskServices/callInterfaceServices/agentUserInformation/agent-user-information.service';

@Directive({
  selector: '[callControll]'
})
export class callInterfaceHideControlDirective {

  isAnimated: boolean = false;

  @HostBinding('style.transform') private transform = 'translatey(0px)';
  constructor(private AgentUserInformation: AgentUserInformation) {
  }

  @HostListener('document:click', ['$event']) public onStop(evt: any) {
    const user = this.AgentUserInformation.getCallInformation();
    // if (user.peer_information?.data?.isScreenShareOn === true) {
    let timeout;
    if (this.isAnimated === false && user.peer_information?.data?.isScreenShareOn === true) {
      evt.preventDefault();
      evt.stopPropagation();
      clearTimeout(timeout);
      (user.is_minimize === false) ? this.transform = 'translatey(500px)' :
        this.transform = 'translatey(0px)';

      this.isAnimated = true;
    } else if (this.isAnimated === true) {
      timeout = setTimeout(() => {
        this.transform = 'translatey(0px)';
        this.isAnimated = false;

      }, 500);
    }
    // } else {
    //   this.transform = 'translatey(0px)';
    // }
  }
}
