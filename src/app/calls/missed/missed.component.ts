import { missedCallData, missedTableSetting } from './missedData';
import { Component } from '@angular/core';
import { CallsService } from '../callService/calls.service';
import { MissedCallModel, MissedCallModelTable } from 'src/app/models/callModel';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';
@Component({
  selector: 'app-missed',
  templateUrl: './missed.component.html',
  styleUrls: ['./missed.component.scss']
})
export class MissedComponent {
  tableSettings = missedTableSetting;
  missedCallData: MissedCallModelTable[] = missedCallData
  constructor(private callservice: CallsService, private CommonService: CommonService
  ) {
    this.callservice.sendDataToMissedTabsSubject.subscribe((data: MissedCallModel[]) => {
      this.missedCallData = data.map((missedCallData) => ({
        agent_name: missedCallData.name,
        call_uuid: missedCallData.call_uuid,
        called_at: this.callservice.gettimedurationformissedandanswered(missedCallData.missed_at).toString(),
        callType: { image: this.CommonService.getConversationType(missedCallData.is_video), text: this.callservice.getCallType(missedCallData.is_video) },
        resaon: missedCallData.reason,
        user_details: { image: '../../../assets/images/callInterface/user.png', text: missedCallData.name },
        user_id: this.callservice.getUserId(missedCallData.user_id),
        utilites: [{ image: this.CommonService.getLanguageFlags(missedCallData.language_id) },
        { image: this.CommonService.getBrowserFlag(missedCallData.browser) }, {
          image: this.CommonService.getDeviceType(missedCallData.desktop)
        }, { image: this.CommonService.getOperatingSystem(missedCallData.operating_system) }],
        wait_time: this.callservice.calculatetime(missedCallData.wait_time).toString()
      }))
    });
  }
}
