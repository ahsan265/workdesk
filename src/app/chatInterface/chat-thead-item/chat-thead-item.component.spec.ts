import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTheadItemComponent } from './chat-thead-item.component';

describe('ChatTheadItemComponent', () => {
  let component: ChatTheadItemComponent;
  let fixture: ComponentFixture<ChatTheadItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatTheadItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatTheadItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
