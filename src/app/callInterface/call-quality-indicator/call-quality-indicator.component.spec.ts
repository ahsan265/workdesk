import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallQualityIndicatorComponent } from './call-quality-indicator.component';

describe('CallQualityIndicatorComponent', () => {
  let component: CallQualityIndicatorComponent;
  let fixture: ComponentFixture<CallQualityIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallQualityIndicatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CallQualityIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
