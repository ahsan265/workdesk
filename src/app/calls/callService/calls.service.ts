/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { oneSelect } from 'src/app/agents/agentsData';
import { OneSelect } from 'src/app/models/oneSelect';
import { QueueSocketService } from 'src/app/workdeskSockets/queueSocket/queue-socket.service';
import { callType } from '../callsData';

@Injectable({
  providedIn: 'root'
})
export class CallsService {
  constructor(private QueueSocketService: QueueSocketService) {}

  public callQueueSocketByLanguageandCall(
    languageId: number[],
    callType: string[],
    tabName: string
  ) {
    this.QueueSocketService.sendQueueParameter({
      call_type: callType,
      languages: languageId,
      tab: tabName
    });
  }

  public getCallTypeId(ids: number[]) {
    let selectedCallType: any = [];
    const callTypeData = callType.data;
    ids.forEach((id: number) => {
      const selectedType = callTypeData.find(
        (data: OneSelect) => id == data.id
      );
      selectedCallType.push(selectedType?.name.toLowerCase());
    });
    return selectedCallType;
  }
}
