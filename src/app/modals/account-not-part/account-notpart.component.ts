import { Component } from '@angular/core';
import { OverlayService } from '@gigaaa/gigaaa-components';

@Component({
  selector: 'app-account-notpart',
  templateUrl: './account-notpart.component.html',
  styleUrls: ['./account-notpart.component.scss']
})
export class AccountNotpartComponent {
  constructor(private OverlayService: OverlayService) {}
  closeDialog() {
    this.OverlayService.close();
  }
}
