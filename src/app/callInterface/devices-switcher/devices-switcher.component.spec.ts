import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesSwitcherComponent } from './devices-switcher.component';

describe('DevicesSwitcherComponent', () => {
  let component: DevicesSwitcherComponent;
  let fixture: ComponentFixture<DevicesSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicesSwitcherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevicesSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
