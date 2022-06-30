import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CallsComponent } from './calls/calls.component';
import { AgentsComponent } from './agents/agents.component';
import { IncomingComponent } from './calls/incoming/incoming.component';
import { OngoingComponent } from './calls/ongoing/ongoing.component';
import { MissedComponent } from './calls/missed/missed.component';
import { AnsweredComponent } from './calls/answered/answered.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    DashboardComponent,
    CallsComponent,
    AgentsComponent,
    IncomingComponent,
    OngoingComponent,
    MissedComponent,
    AnsweredComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
