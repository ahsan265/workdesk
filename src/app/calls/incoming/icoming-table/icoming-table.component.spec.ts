import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcomingTableComponent } from './icoming-table.component';

describe('IcomingTableComponent', () => {
  let component: IcomingTableComponent;
  let fixture: ComponentFixture<IcomingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IcomingTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IcomingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
