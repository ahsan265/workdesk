/* eslint-disable sort-imports */
import {
  CallbackModule,
  CardModule,
  ChartWrapperModule,
  component_data,
  GigaaaButtonModule,
  GigaaaDatepicker,
  GigaaaHeaderModule,
  GigaaaHeaderService,
  GigaaaLandingPageModule,
  GigaaaPaginatePipe,
  GigaaaPaginationModule,
  gigaaaPopupModule,
  GigaaaSidebarModule,
  GigaaaTableModule,
  GigaaaTableWorkdeskModule,
  InputFieldModule,
  LogoutModule,
  ModalWrapperModule,
  MultiSelectDropdownModule,
  OneSelectDropdownModule,
  OverlayService,
  SearchInputFieldModule,
  SwitchButtonModule
} from '@gigaaa/gigaaa-components';
import { AgentSettingsComponent } from './agent-settings/agent-settings.component';
import { AgentsComponent } from './agents/agents.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CallsComponent } from './calls/calls.component';
import { ChartBarComponent } from './charts/chart-bar/chart-bar.component';
import { ChartDoughnutComponent } from './charts/chart-doughnut/chart-doughnut.component';
import { ChartLineComponent } from './charts/chart-line/chart-line.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FilterPipe } from './pipes/filter.pipe';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MainComponent } from './main/main.component';
import { NgChartsModule } from 'ng2-charts';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
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
import { AddAgentComponent } from './modals/add-agent/add-agent.component';
import { AgentListingComponent } from './modals/add-agent/agent-listing/agent-listing.component';
import { scrollStageDirective } from './directives/scrollDirective';
import { CountersComponent } from './components/counters/counters.component';
import { WrongInvitationAccountComponent } from './modals/wrong-invitation-account/wrong-invitation-account.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AuthService } from './services/auth.service';
import { SwitchOrganizationComponent } from './modals/switch-organization/switch-organization.component';
import { SwitchOgranizationDoneComponent } from './modals/switch-ogranization-done/switch-ogranization-done.component';
import { ReDialCallService } from './workdeskServices/reDialCallService/re-dial-call.service';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { CallsIndicatorComponent } from './components/calls-indicator/calls-indicator.component';
import { NoTableDataComponent } from './components/no-table-data/no-table-data.component';
import { IncomingComponent } from './calls/incoming/incoming/incoming.component';
import { MissedComponent } from './calls/missed/missed/missed.component';
import { AnsweredComponent } from './calls/answered/answered/answered.component';
import { OngoingComponent } from './calls/ongoing/ongoing/ongoing.component';
import { agentScrollList } from './directives/agentListDirective';
import { CommonModule } from '@angular/common';
import { ChatConsoleComponent } from './chatInterface/chat-console/chat-console.component';
import { ChatThreadsComponent } from './chatInterface/chat-threads/chat-threads.component';
import { ChatWrapperComponent } from './chatInterface/chat-wrapper/chat-wrapper.component';
import { ChattextAreaComponent } from './chatInterface/chattext-area/chattext-area.component';
import { ChatHeaderComponent } from './chatInterface/chat-header/chat-header.component';
import { ChatTheadItemComponent } from './chatInterface/chat-thead-item/chat-thead-item.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NoChatComponent } from './chatInterface/no-chat/no-chat.component';
import { PreferenceComponent } from './components/preference/preference.component';
import { DashboardCallComponent } from './dashboard/dashboard-call/dashboard-call.component';
import { DashboardChatsComponent } from './dashboard/dashboard-chats/dashboard-chats.component';
import { TicketsComponent } from './tickets/tickets.component';
import { AssignComponent } from './components/assign/assign.component';
import { ColorBackPipe } from './pipes/nameBackground/color-back.pipe';
import { TicketsCreationComponent } from './tickets-creation/tickets-creation.component';
import { TicketWrapperComponent } from './tickets/ticket-wrapper/ticket-wrapper.component';
import { TicketProfileComponent } from './tickets/ticket-profile/ticket-profile.component';
import { TimenowPipe } from './pipes/timeNow/timenow.pipe';
import { scrollDownDirective } from './chatInterface/chatDirectives/arrowDownDirective';
import { scrollingDirective } from './chatInterface/chatDirectives/scrollShowDirective';
import { AgentTableComponent } from './agents/agent-table/agent-table.component';
import { UpdateColumnFieldComponent } from './components/update-column-field/update-column-field.component';
import { editColumnDirective } from './directives/showEditColumnDirective';
import { AnsweredTableComponent } from './calls/answered/answered-table/answered-table.component';
import { IcomingTableComponent } from './calls/incoming/icoming-table/icoming-table.component';
import { MissedTableComponent } from './calls/missed/missed-table/missed-table.component';
import { OngoingTableComponent } from './calls/ongoing/ongoing-table/ongoing-table.component';
import { CallPickButtonComponent } from './calls/incoming/call-pick-button/call-pick-button.component';
import { TimerWidgetComponent } from './components/timer-widget/timer-widget.component';

@NgModule({
  declarations: [
    CallsIndicatorComponent,
    NoTableDataComponent,
    AppComponent,
    DashboardComponent,
    CallsComponent,
    AgentsComponent,
    FooterComponent,
    MainComponent,
    ChartBarComponent,
    ChartLineComponent,
    ChartDoughnutComponent,
    FilterPipe,
    ColorBackPipe,
    PageWrapperComponent,
    AgentSettingsComponent,
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
    agentScrollList,
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
    CountersComponent,
    WrongInvitationAccountComponent,
    LoaderComponent,
    SwitchOrganizationComponent,
    SwitchOgranizationDoneComponent,
    PageNotFoundComponent,
    PaginationComponent,
    IncomingComponent,
    MissedComponent,
    AnsweredComponent,
    OngoingComponent,
    ChatConsoleComponent,
    ChatThreadsComponent,
    ChatWrapperComponent,
    ChattextAreaComponent,
    ChatHeaderComponent,
    ChatTheadItemComponent,
    NoChatComponent,
    PreferenceComponent,
    DashboardCallComponent,
    DashboardChatsComponent,
    TicketsComponent,
    AssignComponent,
    TicketsCreationComponent,
    TicketWrapperComponent,
    TicketProfileComponent,
    TimenowPipe,
    scrollDownDirective,
    scrollingDirective,
    editColumnDirective,
    AgentTableComponent,
    UpdateColumnFieldComponent,
    AnsweredTableComponent,
    IcomingTableComponent,
    MissedTableComponent,
    OngoingTableComponent,
    CallPickButtonComponent,
    TimerWidgetComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
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
    NgxPaginationModule,
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
    FormsModule,
    NgChartsModule,
    DragDropModule,
    OverlayModule,
    GigaaaTableWorkdeskModule,
    GigaaaPaginationModule,
    gigaaaPopupModule,
    ImageCropperModule
  ],
  providers: [
    GigaaaPaginatePipe,
    {
      provide: 'GigaaaHeaderService',
      useClass: GigaaaHeaderService
    },
    {
      provide: APP_INITIALIZER,
      useClass: ReDialCallService
    },
    {
      provide: component_data,
      useClass: OverlayService
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
