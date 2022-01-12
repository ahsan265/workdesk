import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-call-interface',
  templateUrl: './call-interface.component.html',
  styleUrls: ['./call-interface.component.css']
})
export class CallInterfaceComponent implements OnInit {

  screensharebtn:boolean=true;
  micbtn:boolean=false;
  camerabtn:boolean=false;

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
    console.log(val)
    if(val==true)
    { this.micbtn=false;
    }
    else {
      this.micbtn=true;
    }
  }

  camerabtncheck(val)
  {
    console.log(val)
    if(val==true)
    { this.camerabtn=false;
    }
    else {
      this.camerabtn=true;
    }
  }
}
