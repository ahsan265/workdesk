import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-microphone-voice-indicator',
  templateUrl: './microphone-voice-indicator.component.html',
  styleUrls: ['./microphone-voice-indicator.component.scss']
})
export class MicrophoneVoiceIndicatorComponent implements OnInit {
  @Input() voiceLevels!: number;
  @Input() active: any;
  constructor() {}

  ngOnInit(): void {}
  getArray(number: any) {
    return Array(number);
  }
}
