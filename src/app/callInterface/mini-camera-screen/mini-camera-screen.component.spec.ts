import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniCameraScreenComponent } from './mini-camera-screen.component';

describe('MiniCameraScreenComponent', () => {
  let component: MiniCameraScreenComponent;
  let fixture: ComponentFixture<MiniCameraScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiniCameraScreenComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MiniCameraScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
