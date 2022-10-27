/* eslint-disable sort-imports */
import {
  CallbackModule,
  CardModule,
  ChartWrapperModule,
  GigaaaButtonModule,
  GigaaaDatepicker,
  GigaaaHeaderModule,
  GigaaaHeaderService,
  GigaaaLandingPageModule,
  GigaaaSidebarModule,
  GigaaaTableModule,
  GigaaaTableWorkdeskModule,
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
import { linkExpireModalComponent } from './modals/link-expire-modal/link-expire-modal.component';
import { ToastrModule } from 'ngx-toastr';
import { UpdatePasswordComponent } from './modals/update-password/update-password.component';
import { UploadImageComponent } from './modals/upload-image/upload-image.component';
import { DeleteAgentComponent } from './modals/delete-agent/delete-agent.component';
import { ImageUploaderComponent } from './uploadImages/image-uploader/image-uploader.component';
import { ImageCropperComponent } from './uploadImages/image-cropper/image-cropper.component';
import { DragNDropDirective } from './uploadImages/imageDragDropUploadDirective';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CallConsoleComponent } from './callInterface/call-console/call-console.component';
import { CallsHeaderComponent } from './callInterface/calls-header/calls-header.component';
import { CallingScreenComponent } from './callInterface/calling-screen/calling-screen.component';
import { MiniCameraScreenComponent } from './callInterface/mini-camera-screen/mini-camera-screen.component';
import { DevicesSwitcherComponent } from './callInterface/devices-switcher/devices-switcher.component';
import { MicrophoneVoiceIndicatorComponent } from './callInterface/microphone-voice-indicator/microphone-voice-indicator.component';
import { CallControlsComponent } from './callInterface/call-controls/call-controls.component';
import { CallQualityIndicatorComponent } from './callInterface/call-quality-indicator/call-quality-indicator.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { NameInitialsPipe } from './pipes/nameInitials/name-initials.pipe';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { ScreenShareRestrictionComponent } from './callInterface/screen-share-restriction/screen-share-restriction.component';
import { peerMiniCameraAnimation } from './callInterface/callInterfaceDirectives/callInterfaceHideDirective';
import { callInterfaceHideControlDirective } from './callInterface/callInterfaceDirectives/callInterfaceHideControlDirective';
import { CloseDialogOverlayRef } from './callInterface/overLayService/closeDialogService';
import { OverlayService } from './callInterface/overLayService/overlay.service';
import { AddAgentComponent } from './modals/add-agent/add-agent.component';
import { AgentListingComponent } from './modals/add-agent/agent-listing/agent-listing.component';
import { scrollStageDirective } from './directives/scrollDirective';
import { CountersComponent } from './components/counters/counters.component';

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
    linkExpireModalComponent,
    UpdatePasswordComponent,
    UploadImageComponent,
    DeleteAgentComponent,
    ImageUploaderComponent,
    ImageCropperComponent,
    DragNDropDirective,
    peerMiniCameraAnimation,
    callInterfaceHideControlDirective,
    scrollStageDirective,
    CallConsoleComponent,
    CallsHeaderComponent,
    CallingScreenComponent,
    MiniCameraScreenComponent,
    DevicesSwitcherComponent,
    MicrophoneVoiceIndicatorComponent,
    CallControlsComponent,
    CallQualityIndicatorComponent,
    NameInitialsPipe,
    CustomerSupportComponent,
    ScreenShareRestrictionComponent,
    AddAgentComponent,
    AgentListingComponent,
    CountersComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    GigaaaSidebarModule,
    GigaaaHeaderModule.forRoot(environment),
    ToastrModule.forRoot(),
    GigaaaTableModule,
    CallbackModule,
    LogoutModule,
    GigaaaButtonModule,
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
    NgChartsModule,
    DragDropModule,
    OverlayModule,
    GigaaaTableWorkdeskModule
  ],
  providers: [
    {
      provide: 'GigaaaHeaderService',
      useClass: GigaaaHeaderService
    },
    OverlayService,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
