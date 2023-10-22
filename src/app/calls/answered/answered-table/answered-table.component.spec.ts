import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnsweredTableComponent } from './answered-table.component';

describe('AnsweredTableComponent', () => {
  let component: AnsweredTableComponent;
  let fixture: ComponentFixture<AnsweredTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnsweredTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AnsweredTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
