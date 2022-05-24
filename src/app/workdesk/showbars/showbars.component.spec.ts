import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowbarsComponent } from './showbars.component';

describe('ShowbarsComponent', () => {
  let component: ShowbarsComponent;
  let fixture: ComponentFixture<ShowbarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowbarsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowbarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
