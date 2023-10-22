import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-call-pick-button',
  templateUrl: './call-pick-button.component.html',
  styleUrls: ['./call-pick-button.component.css']
})
export class CallPickButtonComponent implements OnInit {
  @Input() buttonText!: string;
  @Input() isButtonDisabled: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
