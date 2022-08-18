import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallConsoleComponent } from './call-console.component';

describe('CallConsoleComponent', () => {
  let component: CallConsoleComponent;
  let fixture: ComponentFixture<CallConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallConsoleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CallConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
