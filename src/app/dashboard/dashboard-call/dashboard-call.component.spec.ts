import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCallComponent } from './dashboard-call.component';

describe('DashboardCallComponent', () => {
  let component: DashboardCallComponent;
  let fixture: ComponentFixture<DashboardCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
