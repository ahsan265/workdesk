import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneSelectDropdownComponent } from './one-select-dropdown.component';

describe('OneSelectDropdownComponent', () => {
  let component: OneSelectDropdownComponent;
  let fixture: ComponentFixture<OneSelectDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [OneSelectDropdownComponent],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneSelectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
