import {
  CallbackModule,
  GigaaaHeaderModule,
  GigaaaHeaderService,
  GigaaaSidebarModule,
  GigaaaTableModule,
  LogoutModule
} from '@gigaaa/gigaaa-components';
import { AgentsComponent } from './agents/agents.component';
import { AnsweredComponent } from './calls/answered/answered.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CallsComponent } from './calls/calls.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomingComponent } from './calls/incoming/incoming.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MissedComponent } from './calls/missed/missed.component';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { OngoingComponent } from './calls/ongoing/ongoing.component';
import { environment } from 'src/environments/environment';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';

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
    AnsweredComponent,
    FooterComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GigaaaSidebarModule,
    GigaaaHeaderModule.forRoot(environment),
    GigaaaTableModule,
    CallbackModule,
    LogoutModule,
    NgxPaginationModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: 'GigaaaHeaderService',
      useClass: GigaaaHeaderService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
