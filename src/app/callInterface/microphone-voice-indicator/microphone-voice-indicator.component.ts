import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { inputOuputdevices } from 'src/app/models/callInterfaceModel';
import { StreamingService } from 'src/app/workdeskServices/callInterfaceServices/stream/streaming.service';

@Component({
  selector: 'app-microphone-voice-indicator',
  templateUrl: './microphone-voice-indicator.component.html',
  styleUrls: ['./microphone-voice-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class MicrophoneVoiceIndicatorComponent implements OnInit {

  @Input() active!: boolean;

  @Input() levels!: number;

  constructor(
  ) { }

  ngOnInit(): void {
  }
  getArray(number: any) {
    return Array(number);
  }

}
