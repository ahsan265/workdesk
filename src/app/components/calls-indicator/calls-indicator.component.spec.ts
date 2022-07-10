import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsIndicatorComponent } from './calls-indicator.component';

describe('CallsIndicatorComponent', () => {
  let component: CallsIndicatorComponent;
  let fixture: ComponentFixture<CallsIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallsIndicatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallsIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
