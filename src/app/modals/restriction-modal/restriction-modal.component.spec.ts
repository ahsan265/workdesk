import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictionModalComponent } from './restriction-modal.component';

describe('RestrictionModalComponent', () => {
  let component: RestrictionModalComponent;
  let fixture: ComponentFixture<RestrictionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestrictionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
