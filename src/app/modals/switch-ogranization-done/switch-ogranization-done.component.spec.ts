import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchOgranizationDoneComponent } from './switch-ogranization-done.component';

describe('SwitchOgranizationDoneComponent', () => {
  let component: SwitchOgranizationDoneComponent;
  let fixture: ComponentFixture<SwitchOgranizationDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchOgranizationDoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchOgranizationDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
