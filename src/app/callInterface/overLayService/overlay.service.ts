import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { CallConsoleComponent } from '../call-console/call-console.component';
interface FilePreviewDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}
@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  constructor(private overlay: Overlay) { }
  DEFAULT_CONFIG: FilePreviewDialogConfig = {
    hasBackdrop: true,
    backdropClass: 'dark-backdrop',
    panelClass: 'tm-file-preview-dialog-panel'
  };
  open() {
    const overlayRef = this.overlay.create();
    const filePreviewPortal = new ComponentPortal(CallConsoleComponent);
    this.createOverlay(this.DEFAULT_CONFIG);
    overlayRef.attach(filePreviewPortal);
  }

  private getOverlayConfig(config: FilePreviewDialogConfig): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }
  private createOverlay(config: FilePreviewDialogConfig) {
    // Returns an OverlayConfig
    const overlayConfig = this.getOverlayConfig(config);

    // Returns an OverlayRef

    return this.overlay.create(overlayConfig);
  }
  close() { }
}
