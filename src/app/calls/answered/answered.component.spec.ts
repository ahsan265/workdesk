import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnsweredComponent } from './answered.component';

describe('AnsweredComponent', () => {
  let component: AnsweredComponent;
  let fixture: ComponentFixture<AnsweredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnsweredComponent],
      teardown: { destroyAfterEach: false }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnsweredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
