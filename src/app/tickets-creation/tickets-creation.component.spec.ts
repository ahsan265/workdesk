import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsCreationComponent } from './tickets-creation.component';

describe('TicketsCreationComponent', () => {
  let component: TicketsCreationComponent;
  let fixture: ComponentFixture<TicketsCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketsCreationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
