import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissedComponent } from './missed.component';

describe('MissedComponent', () => {
  let component: MissedComponent;
  let fixture: ComponentFixture<MissedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [MissedComponent],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
