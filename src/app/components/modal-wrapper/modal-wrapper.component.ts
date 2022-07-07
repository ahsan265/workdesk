import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Modal } from 'src/app/models/modal';

@Component({
  selector: 'app-modal-wrapper',
  templateUrl: './modal-wrapper.component.html',
  styleUrls: ['./modal-wrapper.component.scss']
})
export class ModalWrapperComponent {
  @Input() modalData!: Modal;
  @Output() closeModal = new EventEmitter();
  @Output() submitButtonOutput = new EventEmitter();

  constructor() {}

  onCloseModal() {
    this.closeModal.emit(true);
  }

  onGetButtonOutput(event: boolean) {
    this.submitButtonOutput.emit(event);
  }
}
