import { Component } from '@angular/core';
import {
  OngoingCallModel,
  OngoingCallModelTable
} from 'src/app/models/callModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
import { CallsService } from '../callService/calls.service';
import { ongoingTableSetting } from './ongoingData';

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrls: ['./ongoing.component.scss']
})
export class OngoingComponent {
  ongoingData: OngoingCallModelTable[] = [];
  tableSettings = ongoingTableSetting;
  constructor(
    private callservice: CallsService,
    private CommonService: CommonService
  ) {
    this.callservice.sendDataToOngoingTabsSubject.subscribe(
      (data: OngoingCallModel[]) => {
        this.ongoingData = data.map((answeredData) => ({
          user_details: {
            image: '../../../assets/images/callInterface/user.png',
            text: answeredData.name
          },
          utilites: [
            {
              image: this.CommonService.getLanguageFlags(
                answeredData.language_id
              )
            },
            { image: this.CommonService.getBrowserFlag(answeredData.browser) },
            {
              image: this.CommonService.getDeviceType(answeredData.desktop)
            },
            {
              image: this.CommonService.getOperatingSystem(
                answeredData.operating_system
              )
            }
          ],
          callType: {
            image: this.CommonService.getConversationType(
              answeredData.is_video
            ),
            text: this.callservice.getCallType(answeredData.is_video)
          },
          call_uuid: answeredData.call_uuid,
          duration: this.callservice
            .calculatetime(answeredData.wait_time)
            .toString(),
          agent_name: answeredData.name,
          user_id: this.callservice.getUserId(answeredData.user_id),
          agent_details: {
            image: '../../../assets/images/callInterface/user.png',
            text: 'csahsan021@gmail.com'
          }
        }));
      }
    );
  }
}
