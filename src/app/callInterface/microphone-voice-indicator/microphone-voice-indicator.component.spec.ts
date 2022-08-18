import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrophoneVoiceIndicatorComponent } from './microphone-voice-indicator.component';

describe('MicrophoneVoiceIndicatorComponent', () => {
  let component: MicrophoneVoiceIndicatorComponent;
  let fixture: ComponentFixture<MicrophoneVoiceIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MicrophoneVoiceIndicatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicrophoneVoiceIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
