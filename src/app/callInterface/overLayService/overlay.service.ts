import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector } from '@angular/core';
import { CallConsoleComponent } from '../call-console/call-console.component';
import { CloseDialogOverlayRef } from './closeDialogService';
import { overlayToken } from './overlayToken';
interface ComponentDialogConnfiguration {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  data?: any;
}
@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  constructor(private overlay: Overlay, private injector: Injector) { }
  DEFAULT_CONFIG: ComponentDialogConnfiguration = {
    hasBackdrop: false,
    backdropClass: 'dark-backdrop',
    panelClass: 'dialog-panel',
    data: null
  };
  dialogRef!: CloseDialogOverlayRef;
  open(config: ComponentDialogConnfiguration = {}) {
    const dialogConfig = { ...this.DEFAULT_CONFIG, ...config };

    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.createOverlay(dialogConfig);

    // Instantiate remote control
    this.dialogRef = new CloseDialogOverlayRef(overlayRef);

    const overlayComponent = this.attachDialogContainer(
      overlayRef,
      dialogConfig,
      this.dialogRef
    );
    overlayRef.backdropClick().subscribe((_) => this.dialogRef.close());
    return this.dialogRef;
  }

  private attachDialogContainer(
    overlayRef: OverlayRef,
    config: ComponentDialogConnfiguration,
    dialogRef: CloseDialogOverlayRef
  ) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(
      CallConsoleComponent,
      null,
      injector
    );
    const containerRef: ComponentRef<CallConsoleComponent> =
      overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(
    config: ComponentDialogConnfiguration,
    dialogRef: CloseDialogOverlayRef
  ): Injector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(CloseDialogOverlayRef, dialogRef);
    injectionTokens.set(overlayToken, config.data);
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: overlayToken, useValue: config.data }
      ]
    });
  }
  private getOverlayConfig(
    config: ComponentDialogConnfiguration
  ): OverlayConfig {
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
