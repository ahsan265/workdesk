import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChattextAreaComponent } from './chattext-area.component';

describe('ChattextAreaComponent', () => {
  let component: ChattextAreaComponent;
  let fixture: ComponentFixture<ChattextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChattextAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChattextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
