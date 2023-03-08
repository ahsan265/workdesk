import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { oneSelectData, oneSelectData2, oneSelectData3, searchInputData, tableData, TicketsCard, TicketsCard1, ticketsTableSetting } from './ticketsData';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent {
  constructor(private AuthService: AuthService) {
    this.AuthService.pageTitle.next('Tickets');
  }
  ticketData = TicketsCard;
  ticketData1 = TicketsCard1;
  oneSelectData2 = oneSelectData2;
  oneSelectData3 = oneSelectData3;
  oneSelectData = oneSelectData;
  searchInputData = searchInputData;
  ticketsTableSetting = ticketsTableSetting;
  tableData=tableData;

  getArray(number: number) {
    return new Array(number);
  }
}
