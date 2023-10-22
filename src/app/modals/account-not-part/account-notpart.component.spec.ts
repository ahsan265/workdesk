import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountNotpartComponent } from './account-notpart.component';

describe('AccountNotpartComponent', () => {
  let component: AccountNotpartComponent;
  let fixture: ComponentFixture<AccountNotpartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountNotpartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountNotpartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
