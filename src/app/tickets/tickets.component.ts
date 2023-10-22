import { Component, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  TicketsCard,
  TicketsCard1,
  oneSelectData2,
  oneSelectData3,
  priorityData,
  searchInputData,
  statusType,
  tableData,
  ticketsTableSetting
} from './ticketsData';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent {
  constructor(private AuthService: AuthService, private Router: Router) {
    this.AuthService.pageTitle.next('Tickets');
  }
  ticketData = TicketsCard;
  ticketData1 = TicketsCard1;
  oneSelectData2 = oneSelectData2;
  statusType = statusType;
  priorityData = priorityData;
  searchInputData = searchInputData;
  ticketsTableSetting = ticketsTableSetting;
  tableData = tableData;
  showAssignTickets: boolean = false;
  showAssignDropdown: boolean = false;

  indexValue!: number;
  @ViewChild('assignTickets') assignTickets: any = HTMLElement;
  @ViewChild('assignTicketsDropdown') assignTicketsDropdown: any = HTMLElement;

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.assignTickets?.nativeElement?.contains(event?.target)) {
      this.showAssignTickets = false;
    }
    if (!this.assignTicketsDropdown?.nativeElement?.contains(event?.target)) {
      this.showAssignDropdown = false;
    }
  }

  getArray(number: number) {
    return new Array(number);
  }

  showAssignTicket(index: number) {
    this.indexValue = index;
    this.showAssignTickets = !this.showAssignTickets;
  }
  showAssignPopup() {
    this.showAssignDropdown = !this.showAssignDropdown;
  }

  openCreateTickets() {
    this.Router.navigate(['tickets', 'createticket']);
  }
  openTicketInformation() {
    this.Router.navigate(['tickets', 'manage']);
  }
}
