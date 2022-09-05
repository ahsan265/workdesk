import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenShareRestrictionComponent } from './screen-share-restriction.component';

describe('ScreenShareRestrictionComponent', () => {
  let component: ScreenShareRestrictionComponent;
  let fixture: ComponentFixture<ScreenShareRestrictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenShareRestrictionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenShareRestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
