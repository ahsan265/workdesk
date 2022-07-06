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
import { ButtonComponent } from './components/button/button.component';
import { CallsComponent } from './calls/calls.component';
import { CardComponent } from './components/card/card.component';
import { ChartBarComponent } from './charts/chart-bar/chart-bar.component';
import { ChartDoughnutComponent } from './charts/chart-doughnut/chart-doughnut.component';
import { ChartLineComponent } from './charts/chart-line/chart-line.component';
import { ChartWrapperComponent } from './components/chart-wrapper/chart-wrapper.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { IncomingComponent } from './calls/incoming/incoming.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MainComponent } from './main/main.component';
import { MissedComponent } from './calls/missed/missed.component';
import { ModalWrapperComponent } from './components/modal-wrapper/modal-wrapper.component';
import { MultiSelectDropdownComponent } from './components/multi-select-dropdown/multi-select-dropdown.component';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { OneSelectDropdownComponent } from './components/one-select-dropdown/one-select-dropdown.component';
import { OngoingComponent } from './calls/ongoing/ongoing.component';
import { SearchInputFieldComponent } from './components/search-input-field/search-input-field.component';
import { SwitchButtonComponent } from './components/switch-button/switch-button.component';
import { environment } from 'src/environments/environment';

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
    MainComponent,
    ChartBarComponent,
    ChartLineComponent,
    ChartDoughnutComponent,
    ChartWrapperComponent,
    CardComponent,
    SearchInputFieldComponent,
    InputFieldComponent,
    ButtonComponent,
    SwitchButtonComponent,
    ModalWrapperComponent,
    OneSelectDropdownComponent,
    MultiSelectDropdownComponent
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
    BrowserAnimationsModule,
    FormsModule
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
