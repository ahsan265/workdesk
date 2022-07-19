/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { callType, languauges, searchInputData } from './callsData';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  callType = callType;
  languauges = languauges;
  searchInputData = searchInputData;
  showIndicator = false;
  callsIndicatorData = {};
  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.authService.pageTitle.next('Calls');
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const child: any = this.activatedRoute.firstChild;
          if (child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return child.snapshot.routeConfig.path;
        })
      )
      .subscribe((ttl: string) => {
        if (ttl === 'missed') {
          this.showIndicator = true;
          this.callsIndicatorData = {
            text: '11 missed requests',
            icon: '../assets/images/components/calls_count_missed.svg',
            backgroundColor: '#F4CAD6',
            borderColor: '1px solid #F4CAD6',
            textColor: '#FF155A'
          };
        } else if (ttl === 'answered') {
          this.showIndicator = true;
          this.callsIndicatorData = {
            text: '11 missed requests',
            icon: '../assets/images/components/calls_count_answered.svg',
            backgroundColor: '#EBF6DD',
            borderColor: '1px solid #C1E297',
            textColor: '#76CB09'
          };
        } else {
          this.showIndicator = false;
        }
      });
  }
}
