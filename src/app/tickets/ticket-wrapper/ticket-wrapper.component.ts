import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ticket-wrapper',
  templateUrl: './ticket-wrapper.component.html',
  styleUrls: ['./ticket-wrapper.component.scss']
})
export class TicketWrapperComponent {
  constructor(private AuthService:AuthService)
  {
    this.AuthService.pageTitle.next('Tickets')
  }

}
