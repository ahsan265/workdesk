import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ticket-wrapper',
  templateUrl: './ticket-wrapper.component.html',
  styleUrls: ['./ticket-wrapper.component.scss']
})
export class TicketWrapperComponent {
  constructor() {

  }

}
