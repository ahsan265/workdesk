import { OverlayRef } from '@angular/cdk/overlay';

export class CloseDialogOverlayRef {
  constructor(private overlayRef: OverlayRef) {}

  close(): void {
    this.overlayRef.dispose();
    this.overlayRef.detach();
  }
}
