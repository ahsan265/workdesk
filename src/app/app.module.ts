import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingpageComponent } from './useraccount/landingpage/landingpage.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { FooterComponent } from './useraccount/footer/footer.component';
import { WorkdeskModule } from './workdesk/workdesk.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import { GigaaaApiService } from './service/gigaaaapi.service';
import { MessageService } from './service/messege.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { sharedres_service } from './service/sharedres.service';
import { gigaaasocketapi } from './service/gigaaasocketapi.service';
import { Router, RouterModule } from '@angular/router';
import { LinkexpiredialogComponent } from './useraccount/linkexpiredialog/linkexpiredialog.component';
import { ChartsModule } from 'ng2-charts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ImageCropperModule } from 'ngx-image-cropper';
import { agentsocketapi } from './service/agentsocketapi';

//Auth imports
import { LoginBtnComponent } from './useraccount/landingpage/login-btn/login-btn.component';
import { environment } from 'src/environments/environment';
import { GigaaaSidebarModule, GigaaaHeaderModule, GigaaaTableModule, CallbackModule, LogoutModule, GigaaaHeaderService } from '@gigaaa/gigaaa-components';
import { AuthService } from './service/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { RestrictionModalComponent } from './modals/restriction-modal/restriction-modal.component';
import { restrictionservice } from './service/RouterRestrictionService';
import { MaincomponentComponent } from './maincomponent/maincomponent.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingpageComponent,
    FooterComponent,
    LinkexpiredialogComponent,
    LoginBtnComponent,
    RestrictionModalComponent,
    MaincomponentComponent,
  ],
  imports: [
    ChartsModule,
    ToastrModule.forRoot(),
    WorkdeskModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatListModule,
    MatSidenavModule,
    MatExpansionModule,
    GigaaaSidebarModule,
    GigaaaHeaderModule.forRoot(environment),
    GigaaaTableModule,
    CallbackModule,
    LogoutModule,
    NgxPaginationModule
    
  ],
  bootstrap: [AppComponent],
  providers: [GigaaaApiService,AuthService, restrictionservice 
    ,{
    provide: APP_INITIALIZER,
    useFactory:appInitFactory,
    deps: [restrictionservice,AuthService],
    multi: true
}

,{
    provide: 'GigaaaHeaderService',
    useClass: GigaaaHeaderService
  },
  {
    provide: ErrorHandler,
    useClass: MessageService
  },
  {provide : MatDialogRef, useValue : {}}],
  entryComponents: [LandingpageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],

})
export class AppModule { }
export function appInitFactory(appInitService: restrictionservice): () => Promise<any> {
  return () => appInitService.initCheck()
}