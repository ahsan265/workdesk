import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private toastrService: ToastrService) { }

  public setSuccessMessage(message: string, position?: string): void {
    this.toastrService.success(message, '', {
      timeOut: 3000,
      positionClass: position ? position : 'toast-bottom-right',
      closeButton: true,
      easing: 'ease-in',
      messageClass: 'toastClass'
    });
  }

  public setInformationMessage(message: string, position?: string): void {
    this.toastrService.info(message, '', {
      timeOut: 3000,
      positionClass: position ? position : 'toast-bottom-right',
      closeButton: true,
      easing: 'ease-in',
      messageClass: 'toastClass'
    });
  }

  public setErrorMessage(message: string, position?: string): void {
    this.toastrService.warning(message, '', {
      timeOut: 3000,
      positionClass: position ? position : 'toast-bottom-right',
      closeButton: true,
      easing: 'ease-in',
      messageClass: 'toastClass'
    });
  }
}
