import { Component } from '@angular/core';
import { OverlayService } from 'src/app/callInterface/overLayService/overlay.service';
import {
  IncomingCallModel,
  IncomingCallModelTable
} from 'src/app/models/callModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { GigaaaApiService } from 'src/app/workdeskServices/gigaaaApiService/gigaaa-api-service.service';
import { CallsService } from '../callService/calls.service';
import { incomingTableSetting } from './incomingData';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent {
  tableSettings = incomingTableSetting;
  incomingData: IncomingCallModelTable[] = [];
  constructor(
    private callservice: CallsService,
    private CommonService: CommonService,
    private OverlayService: OverlayService,
    private GigaaaApiService: GigaaaApiService
  ) {
    this.callservice.sendDataToIncomingTabsSubject.subscribe(
      (data: IncomingCallModel[]) => {
        this.incomingData = data.map((incomingData) => ({
          hashIcon: '#',
          call_uuid: incomingData.call_uuid,
          language_icon: '',
          utilites: [
            {
              image: this.CommonService.getLanguageFlags(
                incomingData.language_id
              )
            },
            { image: this.CommonService.getBrowserFlag(incomingData.browser) },
            {
              image: this.CommonService.getDeviceType(incomingData.desktop)
            },
            {
              image: this.CommonService.getOperatingSystem(
                incomingData.operating_system
              )
            }
          ],
          callType: {
            image: this.CommonService.getConversationType(
              incomingData.is_video
            ),
            text: this.callservice.getCallType(incomingData.is_video)
          },
          name: incomingData.name,
          user_id: this.callservice.getUserId(incomingData.user_id),
          time: this.callservice.getElapsedTime(
            incomingData.waiting_started_at
          ),
          userImage: '../../../assets/images/callInterface/user.png',
          showUserImage: false,
          callPickButton: 'Answer',
          showCallButton: true
        }));
      }
    );
  }

  async getCallsId(event: string) {
    let data = { call_uuid: event };
    await this.GigaaaApiService.getcalltype(
      this.CommonService.getEndpointsParamLocal().token,
      this.CommonService.getEndpointsParamLocal().organization,
      this.CommonService.getEndpointsParamLocal().project,
      data
    );
    this.OverlayService.open();
  }
}
