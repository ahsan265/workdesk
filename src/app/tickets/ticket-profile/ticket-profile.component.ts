import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  saveButtonData } from 'src/app/agent-settings/agent-settingData';
import { backButtonData } from 'src/app/tickets-creation/ticketsCreationData';
import { viewProfileButton } from './ticketProfileData';

@Component({
  selector: 'app-ticket-profile',
  templateUrl: './ticket-profile.component.html',
  styleUrls: ['./ticket-profile.component.scss']
})
export class TicketProfileComponent {
  backButtonData = backButtonData;
  saveButtonData = saveButtonData;
  viewProfileButton = viewProfileButton;
  agentProfileForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)
    ]),
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required])
  });
  constructor(private Router: Router) {
  }
  onGetBackButtonOutput(event: any) {
    if (event) {
      this.Router.navigate(['tickets']);
    }
  }
  onGetSaveButtonOutput(event: any) {
    if (event) {
      this.Router.navigate(['tickets']);
    }
  }
}
