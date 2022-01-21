import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-call-interface',
  templateUrl: './call-interface.component.html',
  styleUrls: ['./call-interface.component.css']
})
export class CallInterfaceComponent implements OnInit {

  screensharebtn:boolean=true;
  micbtn:boolean=true;
  camerabtn:boolean=true;
  micIcon="../../../../assets/assets_workdesk/microphone_off.svg";
 cameraIcon="../../../assets/assets_workdesk/camera_off.svg";

  constructor(    public dialogRef: MatDialogRef<CallInterfaceComponent>,
    ) { }

  ngOnInit(): void {
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
    }
    else {
      this.camerabtn=true;
      this.cameraIcon="../../../assets/assets_workdesk/camera_off.svg";

    }
  }
}
