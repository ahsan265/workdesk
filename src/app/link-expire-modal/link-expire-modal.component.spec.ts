import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkExpireModalComponent } from './link-expire-modal.component';

describe('LinkExpireModalComponent', () => {
  let component: LinkExpireModalComponent;
  let fixture: ComponentFixture<LinkExpireModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkExpireModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkExpireModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
