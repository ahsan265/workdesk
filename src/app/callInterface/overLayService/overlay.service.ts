import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { CallConsoleComponent } from '../call-console/call-console.component';
import { CloseDialogOverlayRef } from './closeDialogService';
interface ComponentDialogConnfiguration {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}
@Injectable({
  providedIn: 'root'
})

export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector) { }
  DEFAULT_CONFIG: ComponentDialogConnfiguration = {
    hasBackdrop: false,
    backdropClass: 'dark-backdrop',
    panelClass: 'tm-file-preview-dialog-panel'
  };
  dialogRef!: CloseDialogOverlayRef;
  open(config: ComponentDialogConnfiguration = {}) {
    const dialogConfig = { ...this.DEFAULT_CONFIG, ...config };

    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.createOverlay(dialogConfig);

    // Instantiate remote control
    this.dialogRef = new CloseDialogOverlayRef(overlayRef);

    const overlayComponent = this.attachDialogContainer(overlayRef, dialogConfig, this.dialogRef);

    overlayRef.backdropClick().subscribe(_ => this.dialogRef.close());
  }

  private attachDialogContainer(overlayRef: OverlayRef, config: ComponentDialogConnfiguration, dialogRef: CloseDialogOverlayRef) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(CallConsoleComponent, null, injector);
    const containerRef: ComponentRef<CallConsoleComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }


  private createInjector(config: ComponentDialogConnfiguration, dialogRef: CloseDialogOverlayRef): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(CloseDialogOverlayRef, dialogRef);

    return new PortalInjector(this.injector, injectionTokens);
  }
  private getOverlayConfig(config: ComponentDialogConnfiguration): OverlayConfig {
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
  private createOverlay(config: ComponentDialogConnfiguration) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }
  public close() {
    this.dialogRef.close();
  }
}
