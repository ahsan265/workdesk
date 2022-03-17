import {  Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { GigaaaHeaderService } from '@gigaaa/gigaaa-components';
import { AuthService } from 'src/app/service/auth.service';
import { sharedres_service } from 'src/app/service/sharedres.service';
import { LinkexpiredialogComponent } from '../linkexpiredialog/linkexpiredialog.component';
declare var $: any;

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css'],
})
export class LandingpageComponent implements OnInit {
  registerationarea: boolean = false;
  inviteduserdata: any;
  constructor(
    public authService: AuthService,
    private sharedres: sharedres_service,
    public dialog: MatDialog,
    private router:Router,
    private headerService: GigaaaHeaderService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()==true) {
      this.router.navigate(['dashboard','calls']);
    }
   

   
    this.sharedres.getinivationdetail();
    this.getdetailsforinviteduser();
  }
  getdetailsforinviteduser()
  {
      this.sharedres.inviteduserdetailssubject.subscribe(data=>{
        this.inviteduserdata=data;
        if(data!=null)
        {
          if(data['already_used']!=false)
          {
            this.opendialogforinvitationexpire();
            localStorage.removeItem('gigaaa-invitation');
          }
        }
        else{
          localStorage.removeItem('gigaaa-invitation');
          this.opendialogforinvitationexpire();
        }
      })
  }
    // show dialog for initation expired
    opendialogforinvitationexpire() {
      this.dialog.open(LinkexpiredialogComponent,{
       hasBackdrop:false,
       panelClass:"linkexpired-form-container",
     });

   }
  getsociallinks(linkval: any) {
    window.open(linkval, '_blank');
  }
  //
  tabslinksforfooter(linkval: any) {
    window.open(linkval);
  }

  login() {
    this.headerService.login();
  }
}
