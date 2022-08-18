import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsHeaderComponent } from './calls-header.component';

describe('CallsHeaderComponent', () => {
  let component: CallsHeaderComponent;
  let fixture: ComponentFixture<CallsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallsHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CallsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
