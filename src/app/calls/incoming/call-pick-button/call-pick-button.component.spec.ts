import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallPickButtonComponent } from './call-pick-button.component';

describe('CallPickButtonComponent', () => {
  let component: CallPickButtonComponent;
  let fixture: ComponentFixture<CallPickButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallPickButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CallPickButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
