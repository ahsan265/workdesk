import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { saveButtonData } from '../agent-settings/agent-settingData';
import { CalendarService } from '../calendarService/calendar.service';
import { AuthService } from '../services/auth.service';
import {
  backButtonData,
  priorityData,
  ranges,
  statusType
} from './ticketsCreationData';

@Component({
  selector: 'app-tickets-creation',
  templateUrl: './tickets-creation.component.html',
  styleUrls: ['./tickets-creation.component.scss']
})
export class TicketsCreationComponent {
  oneSelectData = priorityData;
  statusType = statusType;
  backButtonData = backButtonData;
  saveButtonData = saveButtonData;
  constructor(
    private AuthService: AuthService,
    private calendarService: CalendarService,
    private Router: Router,
    private route: ActivatedRoute
  ) {
    const response: boolean = this.Router.url
      .toString()
      .includes('updateticket');
    if (response === false) {
      this.AuthService.pageTitle.next('Create ticket');
    } else {
      this.AuthService.pageTitle.next('Tickets');
    }
  }
  @ViewChild('assignTicketsDropdown') assignTicketsDropdown: any = HTMLElement;
  @ViewChild('assignUserDropdown') assignUserDropdown: any = HTMLElement;
  @ViewChild('calendarDropdown') calendar: any = HTMLElement;
  showAssignDropdown: boolean = false;
  showUserDropdown: boolean = false;
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.calendar?.nativeElement.contains(event?.target)) {
      this.showCalendar = false;
    }
    if (!this.assignTicketsDropdown?.nativeElement.contains(event?.target)) {
      this.showAssignDropdown = false;
    }
    if (!this.assignUserDropdown?.nativeElement.contains(event?.target)) {
      this.showUserDropdown = false;
    }
  }
  startDate: string = '';
  endDate: string = '';
  ranges = ranges;
  aggregate: string = 'this_week';
  date_from: any = dayjs().startOf('week').add(1, 'day');
  date_to: any = dayjs().endOf('week').add(1, 'day');
  selected: any = {
    startDate: this.date_from,
    endDate: this.date_to,
    aggregate: this.aggregate
  };
  alwaysShowCalendars: boolean | undefined;
  showCalendar: boolean = false;
  change(event: any) {
    if (event.startDate) {
      this.date_from = event.startDate;
      this.date_to = event.endDate.add(1, 'day');
      // Needs to be updated
      let compareArray: any[] = [];
      for (const property in this.ranges) {
        if (
          this.date_from !== this.ranges[property][0] &&
          this.date_to !== this.ranges[property][1]
        ) {
          compareArray.push(this.ranges[property][0]);
        }
      }
      if (compareArray.length === 8) {
        // this.aggregate = 'custom';
      }
    }
  }
  rangeClicked(event: any) {
    this.aggregate =
      event.label.charAt(0).toLowerCase() +
      event.label.slice(1).replace(/ /g, '_');
    this.startDate = this.calendarService.getDateRangeFormated(
      event.dates[0].$d
    );
    this.endDate = this.calendarService.getDateRangeFormated(event.dates[1].$d);
  }

  onOpenCalendar() {
    this.showCalendar = !this.showCalendar;
  }
  showAssignPopup() {
    this.showAssignDropdown = !this.showAssignDropdown;
  }
  showUserPopup() {
    this.showUserDropdown = !this.showUserDropdown;
  }
  onGetBackButtonOutput(event: any) {
    this.Router.navigate(['tickets']);
  }
  onGetSaveButtonOutput(event: any) {
    if (event) {
      this.Router.navigate(['tickets']);
    }
  }
}
