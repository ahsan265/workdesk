import { ComponentFixture, TestBed } from '@angular/core/testing';
import { linkExpireModalComponent } from './link-expire-modal.component';

describe('LinkExpireModalComponent', () => {
  let component: linkExpireModalComponent;
  let fixture: ComponentFixture<linkExpireModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [linkExpireModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(linkExpireModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
