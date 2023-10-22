import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketWrapperComponent } from './ticket-wrapper.component';

describe('TicketWrapperComponent', () => {
  let component: TicketWrapperComponent;
  let fixture: ComponentFixture<TicketWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketWrapperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
