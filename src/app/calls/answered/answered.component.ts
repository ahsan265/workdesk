import { agents, dataTableSettings } from './answeredData';
import { Component } from '@angular/core';
import {
  AnsweredCallModel,
  AnsweredCallModelTable
} from 'src/app/models/callModel';
import { answeredTablaSetting } from '../missed/missedData';
import { CallsService } from '../callService/calls.service';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';

@Component({
  selector: 'app-answered',
  templateUrl: './answered.component.html',
  styleUrls: ['./answered.component.scss']
})
export class AnsweredComponent {
  tableSettings = answeredTablaSetting;
  answeredData: AnsweredCallModelTable[] = [];
  constructor(
    private callservice: CallsService,
    private CommonService: CommonService
  ) {
    this.callservice.sendDataToAnsweredTabsSubject.subscribe(
      (data: AnsweredCallModel[]) => {
        this.answeredData = data.map((answeredData) => ({
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
            .calculatetime(answeredData.call_time)
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
