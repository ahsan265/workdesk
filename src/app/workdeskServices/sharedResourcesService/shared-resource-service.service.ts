import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServices {
  public LoadcommonEpsubject = new Subject();
  public closeImageUploadDialog = new Subject<boolean>();
  public closeAddAgentDialog = new Subject<boolean>();
  public switchOrganizationDialog = new Subject<boolean>();
  public switchOrganizationDoneDialog = new Subject<boolean>();
  public saveImageUpload = new Subject<boolean>();
  public setAgentImage = new Subject<string>();
  public PasswordPopup = new Subject<boolean>();
  constructor() { }

  // load common eps
  loadCommonEps(value: number) {
    this.LoadcommonEpsubject.next(value);
  }

  // close image dialog
  closeImageDialog(value: boolean) {
    this.closeImageUploadDialog.next(value);
  }
  // save image to data
  saveAgentImage(value: boolean) {
    this.saveImageUpload.next(value);
  }

  updateAgentImage(value: string) {
    this.setAgentImage.next(value);
  }
  // close password popup

  closePasswordPopup(value: boolean) {
    this.PasswordPopup.next(value);
  }
  // close add Agent popup 
  closeAddAgentPopup(value: boolean) {
    this.closeAddAgentDialog.next(value)
  }

  // close open switch organization dialog 
  switchOrganization(value: boolean) {
    this.switchOrganizationDialog.next(value)
  }

  // show open and close 
  showDoneOrganization(value:boolean)
  {
    this.switchOrganizationDoneDialog.next(value);
  }
}
