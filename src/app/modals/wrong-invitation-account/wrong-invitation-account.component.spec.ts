import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrongInvitationAccountComponent } from './wrong-invitation-account.component';

describe('WrongInvitationAccountComponent', () => {
  let component: WrongInvitationAccountComponent;
  let fixture: ComponentFixture<WrongInvitationAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrongInvitationAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrongInvitationAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
