import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-restriction-modal',
  templateUrl: './restriction-modal.component.html',
  styleUrls: ['./restriction-modal.component.css']
})
export class RestrictionModalComponent implements OnInit {
  @Output() function = new EventEmitter;

  constructor() { }

  ngOnInit(): void {
  }

  onButtonClick() {
    this.function.emit(true)
  }

}
