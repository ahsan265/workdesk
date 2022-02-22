import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { WorkdeskRoutingModule } from './workdesk-routing.module';
import { AgentComponent } from './agents/agent.component';
import { UserloginserviceService } from '../service/userloginservice.service';
import { ChatComponent } from './call/chat.component';
import { EditformComponent } from './editform/editform.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddagentComponent } from './addagent/addagent.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InviteagentComponent } from './agents/inviteagent/inviteagent.component';
import { AgentsettingsComponent } from './agents/agentsettings/agentsettings.component';
import { DeleteagentpopupComponent } from './agents/deleteagentpopup/deleteagentpopup.component';
import { CountUpModule } from 'ngx-countup';
import { UpdatepasswordComponent } from './agents/updatepassword/updatepassword.component';
import { ChartsModule } from 'ng2-charts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CroppictureComponent } from './agents/croppicture/croppicture.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { getloadpictures } from './Datapipes/datapipes';
import { percentcolorpipe } from './Datapipes/percentcolor';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSliderModule} from '@angular/material/slider';
import { DragDirective } from './agents/croppicture/dragdroppic';
import { agentsocketapi } from '../service/agentsocketapi';
import { gigaaasocketapi } from '../service/gigaaasocketapi.service';
import { MobilefiltersforagentsComponent } from './mobilefiltersforagents/mobilefiltersforagents.component';
import { CallMobilePopupFilterComponent } from './call/call-mobile-popup-filter/call-mobile-popup-filter.component';
import { MobilefilterspopupComponent } from './dashboard/mobilefilterspopup/mobilefilterspopup.component';
import { getflagpipes } from './Datapipes/flagpipe';
import { getbrowserpipes } from './Datapipes/getbrowserpipe';
import { getdevicepipes } from './Datapipes/devicepipe';
import { getospipes } from './Datapipes/ospipe';
import { getcalltypepipes } from './Datapipes/calltype_iconpipe';
import { getcalltypetextpipes } from './Datapipes/changecalltypetext';
import { CallInterfaceComponent } from './call/call-interface/call-interface.component';
import { getcapitalletter } from './Datapipes/capitalizepipe';
import { webrtcsocket } from '../service/webrtcsocket';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { notAvailable } from './Datapipes/NotAvailablepipe';


@NgModule({
  declarations:[CallMobilePopupFilterComponent,MobilefiltersforagentsComponent,
     DragDirective,percentcolorpipe,
     getloadpictures, 
     AgentComponent, 
     ChatComponent,
      EditformComponent, 
      AddagentComponent, 
      DashboardComponent, 
      InviteagentComponent, 
      AgentsettingsComponent, 
      DeleteagentpopupComponent, 
      UpdatepasswordComponent, 
      CroppictureComponent,
      MobilefilterspopupComponent, 
      getflagpipes,
      getbrowserpipes,
      getdevicepipes,
      getospipes,
      getcalltypepipes,
      getcalltypetextpipes,
      getcapitalletter,
      CallMobilePopupFilterComponent,
      CallInterfaceComponent,
      notAvailable
      ],
  imports: [ CarouselModule.forRoot(), Ng2SearchPipeModule,  ImageCropperModule,
    BsDatepickerModule.forRoot(),
    ChartsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkdeskRoutingModule,
    MatDialogModule,
    CountUpModule,
    MatProgressBarModule,
    MatSliderModule,
    DragDropModule,
  ],
  providers: [agentsocketapi,gigaaasocketapi,webrtcsocket],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],

})
export class WorkdeskModule { }
