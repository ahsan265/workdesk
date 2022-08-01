import {
  ButtonModule,
  CallbackModule,
  CardModule,
  ChartWrapperModule,
  GigaaaDatepicker,
  GigaaaHeaderModule,
  GigaaaHeaderService,
  GigaaaLandingPageModule,
  GigaaaSidebarModule,
  GigaaaTableModule,
  InputFieldModule,
  LogoutModule,
  ModalWrapperModule,
  MultiSelectDropdownModule,
  OneSelectDropdownModule,
  SearchInputFieldModule,
  SwitchButtonModule
} from '@gigaaa/gigaaa-components';
import { AgentSettingsComponent } from './agent-settings/agent-settings.component';
import { AgentsComponent } from './agents/agents.component';
import { AnsweredComponent } from './calls/answered/answered.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CallsComponent } from './calls/calls.component';
import { CallsIndicatorComponent } from './components/calls-indicator/calls-indicator.component';
import { ChartBarComponent } from './charts/chart-bar/chart-bar.component';
import { ChartDoughnutComponent } from './charts/chart-doughnut/chart-doughnut.component';
import { ChartLineComponent } from './charts/chart-line/chart-line.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FilterPipe } from './pipes/filter.pipe';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IncomingComponent } from './calls/incoming/incoming.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MainComponent } from './main/main.component';
import { MissedComponent } from './calls/missed/missed.component';
import { NgChartsModule } from 'ng2-charts';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { OngoingComponent } from './calls/ongoing/ongoing.component';
import { PageWrapperComponent } from './components/page-wrapper/page-wrapper.component';
import { environment } from 'src/environments/environment';
import { LinkExpireModalComponent } from './link-expire-modal/link-expire-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CallsComponent,
    AgentsComponent,
    IncomingComponent,
    OngoingComponent,
    MissedComponent,
    AnsweredComponent,
    FooterComponent,
    MainComponent,
    ChartBarComponent,
    ChartLineComponent,
    ChartDoughnutComponent,
    FilterPipe,
    PageWrapperComponent,
    AgentSettingsComponent,
    CallsIndicatorComponent,
    LandingPageComponent,
    LinkExpireModalComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,     
    BrowserModule,
    AppRoutingModule,
    GigaaaSidebarModule,
    GigaaaHeaderModule.forRoot(environment),
    GigaaaTableModule,
    CallbackModule,
    LogoutModule,
    ButtonModule,
    CardModule,
    ChartWrapperModule,
    InputFieldModule,
    ModalWrapperModule,
    GigaaaDatepicker.forRoot({
      applyLabel: 'Okay',
      firstDay: 3
    }),
    MultiSelectDropdownModule,
    OneSelectDropdownModule,
    SearchInputFieldModule,
    SwitchButtonModule,
    GigaaaLandingPageModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    FormsModule,
    NgChartsModule
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
