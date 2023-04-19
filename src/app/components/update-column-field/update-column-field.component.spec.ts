import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateColumnFieldComponent } from './update-column-field.component';

describe('UpdateColumnFieldComponent', () => {
  let component: UpdateColumnFieldComponent;
  let fixture: ComponentFixture<UpdateColumnFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateColumnFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateColumnFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
