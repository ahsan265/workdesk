import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallInterfaceComponent } from './call-interface.component';

describe('CallInterfaceComponent', () => {
  let component: CallInterfaceComponent;
  let fixture: ComponentFixture<CallInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallInterfaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
