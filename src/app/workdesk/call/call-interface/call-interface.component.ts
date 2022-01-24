import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-call-interface',
  templateUrl: './call-interface.component.html',
  styleUrls: ['./call-interface.component.css']
})
export class CallInterfaceComponent implements OnInit,AfterViewInit,OnDestroy  {
  dragPosition = {x: 0, y: 0};

  screensharebtn:boolean=true;
  micbtn:boolean=true;
  camerabtn:boolean=true;
 screenSize:boolean=true;
  micIcon="../../../../assets/assets_workdesk/microphone_off.svg";
 cameraIcon="../../../assets/assets_workdesk/camera_off.svg";
  is_dragable:boolean=true;
 hideContant:boolean=true;
 hidecamera:boolean=false;
 @ViewChild(TemplateRef) _dialogTemplate: TemplateRef<any>;
 private _overlayRef: OverlayRef;
 private _portal: TemplatePortal;
  constructor(private _overlay: Overlay, 
    private _viewContainerRef: ViewContainerRef,   
     public dialogRef: MatDialogRef<CallInterfaceComponent>,
    ) 
    {
     }
  ngAfterViewInit(): void {
    
    this._portal = new TemplatePortal(this._dialogTemplate, this._viewContainerRef);
    this._overlayRef = this._overlay.create({ positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true,
    });
    
      this._overlayRef.backdropClick().subscribe(()=>{
       
      });

    
  }
  changePosition() {
    this.dragPosition = {x: this.dragPosition.x , y: this.dragPosition.y};
  }
  ngOnInit(): void {

  
  }
  ngOnDestroy() {
    this._overlayRef.dispose();
  }
  closecall()
  {
    this.dialogRef.close(); 
  }

  screensharebtncheck(val)
  {
    console.log(val)
    if(val==true)
    { this.screensharebtn=false;
    }
    else {
      this.screensharebtn=true;
    }
  }

  micebtncheck(val)
  {
    if(val==true)
    { this.micbtn=false;
      this.micIcon="../../../../assets/assets_workdesk/microphone.svg";

    }
    else {
      this.micbtn=true;
      this.micIcon="../../../../assets/assets_workdesk/microphone_off.svg";
    }
  }

  camerabtncheck(val)
  {
    console.log(val)
    if(val==true)
    { this.camerabtn=false;
      this.cameraIcon="../../../assets/assets_workdesk/video.svg";
      if(this.is_dragable==false)
      {
        this.dialogRef.removePanelClass('minimizecallinterface');
        this.dialogRef.addPanelClass('maximizeVideocallinterface'); 
        this.hidecamera=false;

      }
    }
    else {
      this.camerabtn=true;
      this.cameraIcon="../../../assets/assets_workdesk/camera_off.svg";
      if(this.is_dragable==false)
      {
        this.dialogRef.removePanelClass('maximizeVideocallinterface');
        this.dialogRef.addPanelClass('minimizecallinterface');
        this.hidecamera=true;
      }

    }
    }
    // maximize the screen 

       miniMizetheScreen(val)
      {   
        if(val==true)
        { this.hideContant=false;
          this.is_dragable=false;
       
          this.dialogRef.removePanelClass('maximizecallinterface');
          if(this.camerabtn==false)
          {
            this.dialogRef.addPanelClass('maximizeVideocallinterface');
            this.hidecamera=false;
          }
          else 
          { this.dialogRef.addPanelClass('minimizecallinterface');
            this.hidecamera=true;
          }
    

        }
        else{
          this.hideContant=true;
          this.is_dragable=true;
          this.hidecamera=false;
          this.changePosition();
          this.dialogRef.removePanelClass('minimizecallinterface');
          this.dialogRef.removePanelClass('maximizeVideocallinterface');
          this.dialogRef.addPanelClass('maximizecallinterface');
       

        }
        
      }
      // minimize the screen
      maxMizetheScreen()
      { 
       
      }
}
