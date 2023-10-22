import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileComponent } from './ticket-profile.component';

describe('TicketProfileComponent', () => {
  let component: TicketProfileComponent;
  let fixture: ComponentFixture<TicketProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketProfileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
