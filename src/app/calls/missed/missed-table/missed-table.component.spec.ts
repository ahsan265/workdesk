import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissedTableComponent } from './missed-table.component';

describe('MissedTableComponent', () => {
  let component: MissedTableComponent;
  let fixture: ComponentFixture<MissedTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissedTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
