import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingTableComponent } from './ongoing-table.component';

describe('OngoingTableComponent', () => {
  let component: OngoingTableComponent;
  let fixture: ComponentFixture<OngoingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngoingTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngoingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
