import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from 'src/app/workdeskServices/commonEndpoint/common.service';

@Pipe({
  name: 'timenow'
})
export class TimenowPipe implements PipeTransform {
  constructor(private CommonService: CommonService) {}
  transform(value: unknown, ...args: unknown[]): unknown {
    return this.time_ago(value);
  }
  time_ago(time: any) {
    return this.CommonService.timeNow(time);
  }
}
