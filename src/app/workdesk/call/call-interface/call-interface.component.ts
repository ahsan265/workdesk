import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { url } from 'inspector';
import { element, promise } from 'protractor';
import { interval, of, Subject } from 'rxjs';
import { MessageService } from 'src/app/service/messege.service';
import { sharedres_service } from 'src/app/service/sharedres.service';
import { webrtcsocket } from 'src/app/service/webrtcsocket';
import { environment } from 'src/environments/environment';
import { textChangeRangeIsUnchanged } from 'typescript';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { trace } from 'console';
import { getTime } from 'ngx-bootstrap/chronos/utils/date-getters';
import { agentsocketapi } from 'src/app/service/agentsocketapi';
import { publish } from 'rxjs/operators';
import { ThemeService } from 'ng2-charts';
import { async } from '@angular/core/testing';
import { Stream } from 'stream';




@Component({
  selector: 'app-call-interface',
  templateUrl: './call-interface.component.html',
  styleUrls: ['./call-interface.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class CallInterfaceComponent implements OnInit,AfterViewInit,OnDestroy  {  
  private destroyed$ = new Subject();

  isVideo:boolean|object=false;
  hasEchoCancellation=false;
  webrtcmediacontraints={
  audio:true,
  video:this.isVideo,
}
hasVideoparam={width:226,height:144};
 webrtcmediacontraints_user={
  offerToReceiveAudio:true,
  offerToReceiveVideo:true,
  iceRestart:true
}
  unsplitIcon='../../../../assets/assets_workdesk/split_icon14.svg';
  splitIcon='../../../../assets/assets_workdesk/smallscreen_icon14.svg'

  splitscreen:boolean=false;
  localstream:MediaStream;
  sharescreen:MediaStream;
  peerconnection:RTCPeerConnection;
  @ViewChild ('localVideo')  localVideo: ElementRef;
  @ViewChild ('localVideo1')  localVideo1: ElementRef;

      
  @ViewChild ('remoteVideo')  remotevideo: ElementRef;
  @ViewChild ('remoteVideo1')  remotevideo1: ElementRef;

 showUserRemoveVideo:boolean;
  dragPosition = {x: 0, y: 0};

  screensharebtn:boolean=true;
  micbtn:boolean=false;
  camerabtn:boolean=true;
  screenSize:boolean=true;
  micIcon="../../../../assets/assets_workdesk/microphone.svg";
  cameraIcon="../../../assets/assets_workdesk/camera_off.svg";
  is_dragable:boolean=true;
  hideContant:boolean=true;
  hidecamera:boolean=false;
  userid:any;
  peerUserid:any;
 @ViewChild(TemplateRef) _dialogTemplate: TemplateRef<any>;
 localoffer:any;

 userFirstName:any;
 userLastName:any;
 firstuserFirstName:any;
 firstuserLastName:any;
 userPicture:any;
 callstarttime:any;
 callstart:any=false;

 peerFirstname:any;
 peerLastname:any;
 peerFirstnameinitials:any;
 peerLastnameinitials:any;
 peerPicture:any;
 peersmallImage:any;
 peercamera:boolean=false;
 peerscreenView:boolean=false;
  remoteVideosrc:any;

   mediaDevices = navigator.mediaDevices as any;
      constructor(private changeDetector: ChangeDetectorRef,
     public dialogRef: MatDialogRef<CallInterfaceComponent>,
     private webrtcservice:webrtcsocket,
     @Inject(MAT_DIALOG_DATA) public data,
     private renderer: Renderer2,
        private message:MessageService) 
        { 
           
        }
        // request video and audio 
        private async requestmediadevices(val:any): Promise<void>
        {
          try {
          this.localstream=await navigator.mediaDevices.getUserMedia(val)
          this.localVideo.nativeElement.srcObject= this.localstream;
          this.localVideo1.nativeElement.srcObject= this.localstream;
              }
          catch (e) {
          console.log(e);
            }
         
          }
            ngOnDestroy(): void {
            this.destroyed$.next();
            this.destroyed$.complete();
          }

          ngOnInit(): void {
        
  
          this.showUserInformation()
          interval(1000).subscribe(() => {
            if (!this.changeDetector['destroyed']) {
              this.changeDetector.detectChanges();
            }
          });
           this.changeDetector.detectChanges();
          // this.CallDuration()
         
        }
       
        showUserInformation()
        {
          const user = JSON.parse(localStorage.getItem('gigaaa-user'));
          this.userFirstName=user.profile.first_name;
          this.userLastName=user.profile.last_name;
          this.userPicture=user.agent_images['96'];
          this.firstuserFirstName= this.userFirstName.toUpperCase().charAt(0);
          this.firstuserLastName= this.userLastName.toUpperCase().charAt(0)

        }

        // send offer to user  and call 
        private async sendOffertoUser(id:any):Promise <void>
          {
            if(!this.peerconnection)
            {
              try{
              await  this.createPeerConnection().finally(()=>{
                const localtrack=  this.localstream.getAudioTracks()[0]
                this.peerconnection.addTrack(localtrack,this.localstream);
                })
                const offer:RTCSessionDescriptionInit=await this.peerconnection.createOffer(this.webrtcmediacontraints_user);
                await this.peerconnection.setLocalDescription(offer);
                 this.localoffer=offer;
                 console.log(this.localoffer)
              }
              catch(err){
                console.log(err)
              }
              }
    }
    // detect browser
    detectBrowserName() { 
      const agent = window.navigator.userAgent.toLowerCase()
      switch (true) {
        case agent.indexOf('edge') > -1:
          return 'edge';
        case agent.indexOf('opr') > -1 && !!(<any>window).opr:
          return 'opera';
        case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
          return 'chrome';
        case agent.indexOf('trident') > -1:
          return 'ie';
        case agent.indexOf('firefox') > -1:
          return 'firefox';
        case agent.indexOf('safari') > -1:
          return 'safari';
        default:
          return 'other';
      }
    }
    // create peer fucntion 
   private  async  createPeerConnection(): Promise<void>
    {
     this.peerconnection= new RTCPeerConnection({
     
          iceServers:[
            {
              urls: 'turn:13.81.45.178:3478?transport=tcp',  // A TURN server
              username: 'username',
              credential: 'password',
              credentialType: 'password'
            },
            {
              urls: 'stun:stun.l.google.com:19302',
            }
        ],
        
        iceCandidatePoolSize: 10,
      });
 
      this.peerconnection.onicecandidate= this.handIceCandidateEvent;
      this.peerconnection.oniceconnectionstatechange=this.handleIceConnectionStateChangeEvent;
      this.peerconnection.onsignalingstatechange=this.handleSignalingStatetChangeEvent;
      this.peerconnection.ontrack=this.handleTrackEvent;
      await this.requestmediadevices(this.webrtcmediacontraints); 
       this.message.setSuccessMessage("Peer connection")
    }
    // close video call 
  private   closeVideoCall()
    {
      this.localstream.getTracks().forEach(track=> {
        track.stop();
        this.peerconnection.close();
   
      });
      if(this.sharescreen!=undefined)
      {
        this.sharescreen.getTracks().forEach(track=>{
          track.stop();
        })
      }
      this.webrtcservice.ws.close();
        this.dialogRef.close();
      
    }
    // handle error 
    handleError(e:Error)
    {
      switch(e.name)
      {
        case 'NotFoundError':
        this.message.setErrorMessage("Unaable to attent the call because no camera or microphone");
        break;
      }
    }
    // handle event function 
    private handIceCandidateEvent=(event:RTCPeerConnectionIceEvent)=>
    {
      if(event.candidate)
      {
        this.webrtcservice.sendDataforCall({type:'ice-candidate',
        data:event.candidate});
      }
    }
    private handleIceConnectionStateChangeEvent=(event:Event)=>{
      console.log(event)
      switch(this.peerconnection.iceConnectionState)
      {
          case "closed":
          case "failed":
          case "disconnected":
            this.hangupCall();
          break;
      }
    }
    private handleSignalingStatetChangeEvent=(event:Event)=>{
      console.log(event)

      switch(this.peerconnection.signalingState)
      {
          case "closed":
          this.hangupCall();
          break;
      }
    }
    private handleTrackEvent=(event:RTCTrackEvent)=>{
      console.log(event)
        this.remotevideo.nativeElement.srcObject= event.streams[0];
    }
  
   
   ngAfterViewInit(): void {
     this.webrtcservice.callUserSocket(this.data.call_uuid);
     this.addIncomingCallHandler();
   
  }
  // add incoming call handler
  addIncomingCallHandler()
  {
    this.webrtcservice.callobject$.subscribe((msg:any)=>{
   
      switch(msg.type)
      {

          case "offer":
            if(msg.data!=undefined)
            {
              this.handleOfferMessage(msg.data);
            }
          break;
          case "answer":
          this.handleAnswereMessage(msg.data);
          break;
          case "hangup":
          this.hanndleHangupMessage(msg.data);
          break;  
          case "ice-candidate":
            console.log(msg)
          this.handleIceCandidateMessage(msg.data);
          break;
          case "user_id":
          this.userid=msg.id;
          this.sendOffertoUser(msg.id);
          break;
          case "accept":
          this.peerUserid=msg.user_id;
          //this.sendOffertoUser(this.userid);
          this.webrtcservice.sendDataforCall({type:"offer",data:this.localoffer,user_id: this.peerUserid});
          this.callstart=true;
          this.callstarttime=new Date().getTime();
          this.senduserInformation();
          break;
          case "peer_data":
          this.getPeerDataInformation(msg.data);
          break;
          default:
          console.log("Unknow Message :"+msg.type);    

      }
    },(err:any)=>{
      this.message.setErrorMessage(err);
    })
  }
  // message handler 
  private async  handleOfferMessage (msg:RTCSessionDescriptionInit): Promise<void>
  {
   
    await   this.peerconnection.setRemoteDescription(new RTCSessionDescription(msg)).then(async ()=>{
      this.localVideo.nativeElement.srcObject=this.localstream;
    }).then(() => {
      // Build SDP for answer message
      return this.peerconnection.createAnswer();
    }).then((answer) => {
      // Set local SDP
     return this.peerconnection.setLocalDescription(answer);

    }).then(() => {
      this.webrtcservice.sendDataforCall({type:"answer",data:this.peerconnection.localDescription});
    }).catch(err=>{
    });

  }
  private async handleAnswereMessage(data:RTCSessionDescriptionInit): Promise<void>
  { 
    await   this.peerconnection.setRemoteDescription(new RTCSessionDescription(data));
  }

  private hanndleHangupMessage(msg:Message)
  {
    this.hangupCall();
  }
  
  private async  handleIceCandidateMessage(data:RTCIceCandidate): Promise<void>
  { 
    if (data) {
     await  this.peerconnection.addIceCandidate(new RTCIceCandidate(data)).catch(err=>{
    });
  }
  }

  // hang up the call ()
  hangupCall()
  {
    this.localstream.getTracks().forEach(track=>{
      track.stop();
    })
    if(this.screensharebtn==false)
    {
      this.sharescreen.getTracks().forEach(track=>{
        track.stop();
      })
    }
    this.webrtcservice.sendDataforCall({type:"hangup",data:""});
    this.closeVideoCall();
  }
  


  changePosition() {
    this.dragPosition = {x: this.dragPosition.x , y: this.dragPosition.y};
  }
  
 

  screensharebtncheck(val:any)
  {
    console.log(val)
    if(val==true)
    {
      this.screenShare(true);
    }
    else {
      this.screenShare(false);
    }
  }

  micebtncheck(val:any)
  {
    console.log(val)
    if(val==true)
    { this.micbtn=false;
      this.startAudio();
      this.micIcon="../../../../assets/assets_workdesk/microphone.svg";
    
    }
    else {
      this.micbtn=true;
      this.pauseAudio();
      this.micIcon="../../../../assets/assets_workdesk/microphone_off.svg";
    }
  }

  camerabtncheck(val:any)
  {
    console.log(val)
    if(this.screensharebtn==true)
    {
      if(val==true)
      { this.camerabtn=false;
        this.cameraIcon="../../../assets/assets_workdesk/video.svg";
        this.startvideoCall();
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
        this.pausevideoCall();
        if(this.is_dragable==false)
        {
          if(this.peercamera==false && val==false)
          {  
            this.dialogRef.removePanelClass('maximizeVideocallinterface');
            this.dialogRef.addPanelClass('minimizecallinterface');
            this.hidecamera=true;
          }
        }
      }

    }
    else{
      this.message.setErrorMessage("Screen sharing is enabaled")
    }
    
    }
    // maximize the screen 

       miniMizetheScreen(val:any)
      {   
        console.log(val)
        if(val==true)
        { 
          this.hideContant=false;
          this.is_dragable=false;
          this.dialogRef.removePanelClass('callinterface-form-container');
          if(this.camerabtn==false || this.peercamera==true)
          {
            this.dialogRef.addPanelClass('maximizeVideocallinterface');
            this.hidecamera=false;
          }
          else 
          { this.dialogRef.addPanelClass('minimizecallinterface');
            this.hidecamera=true;
          }
           this.unsplitIcon='../../../../assets/assets_workdesk/split_icon12.svg';
           this.splitIcon='../../../../assets/assets_workdesk/smallscreen_icon12.svg'

        }
        else{
          this.unsplitIcon='../../../../assets/assets_workdesk/split_icon14.svg';
          this.splitIcon='../../../../assets/assets_workdesk/smallscreen_icon14.svg'
          this.hideContant=true;
          this.is_dragable=true;
          this.hidecamera=false;
          this.changePosition();
          this.dialogRef.removePanelClass(['maximizeVideocallinterface','minimizecallinterface']);

          this.dialogRef.addPanelClass('callinterface-form-container');

        }

       
        
      }
   
      private async  startvideoCall() :Promise<void>
      {          
        this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
        this.localstream.getVideoTracks().forEach(track => {
          track.enabled=true;
        }); 
         this.webrtcmediacontraints.video=this.hasVideoparam; 
         navigator.mediaDevices.getUserMedia(this.webrtcmediacontraints).then((stream)=>{
          const videotrack=stream.getVideoTracks();
           this.localVideo.nativeElement.srcObject = undefined;
           this.localVideo1.nativeElement.srcObject= undefined;
           this.localstream.addTrack(videotrack[0]);
           this.localVideo1.nativeElement.srcObject=this.localstream;
            this.localVideo.nativeElement.srcObject=this.localstream;
           this.peerconnection.addTrack(videotrack[0],this.localstream);
          }).then(async ()=>{
          const offer:RTCSessionDescriptionInit=await this.peerconnection.createOffer({
            offerToReceiveAudio:true,
            offerToReceiveVideo:true,
            iceRestart:true
          });
          await this.peerconnection.setLocalDescription(offer);
          this.webrtcservice.sendDataforCall({user_id:this.peerUserid,data:offer, type: "offer" });
        })
      
      }
       private async   pausevideoCall() :Promise<void>
          {      
            //  this.localstream.getVideoTracks()[0].enabled=false;   
            this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
            this.localstream.getVideoTracks().forEach(track => {
            track.enabled=false;
            });   
            this.webrtcmediacontraints.video=false; 
            navigator.mediaDevices.getUserMedia(this.webrtcmediacontraints).then((stream)=>{
            const videotrack=stream.getAudioTracks()[0];
            this.localVideo.nativeElement.srcObject = undefined;
            this.localVideo1.nativeElement.srcObject= undefined;
            this.localVideo1.nativeElement.srcObject=this.localstream;
            this.localVideo.nativeElement.srcObject=this.localstream;
            
            this.localstream.addTrack(videotrack);
            }).then(async ()=>{
                const offer:RTCSessionDescriptionInit=await this.peerconnection.createOffer({
                offerToReceiveAudio:true,
                offerToReceiveVideo:true,
                iceRestart:true
              });
              await this.peerconnection.setLocalDescription(offer);
              this.webrtcservice.sendDataforCall({user_id:this.peerUserid,data:offer, type: "offer" });
                })
                  }
                  splitScreen(val:any)
                  {
                  if(val==true)
                  {
                  this.splitscreen=false;
                  this.changePosition();

                  }
                  else if(val==false)
                  { 
                    this.splitscreen=true;

                  }
                }


      startAudio()
      { 
        this.localstream.getAudioTracks()[0].enabled=true;
      if(this.sharescreen!=undefined)
      {
        this.sharescreen.getAudioTracks()[0].enabled=true;
      }
      }
      
      pauseAudio()
      {
        this.localstream.getAudioTracks()[0].enabled=false;
        if(this.sharescreen!=undefined)
        {
          this.sharescreen.getAudioTracks()[0].enabled=false;
        }
      }


    CallDuration(entry) {
      let newday= new Date(entry) ;
      let totalSeconds = Math.floor((new Date().getTime() - newday.getTime()) / 1000);
    
      let hours = 0;
      let minutes = 0;
      let seconds = 0;
  
      if (totalSeconds >= 3600) {
        hours = Math.floor(totalSeconds / 3600);      
        totalSeconds -= 3600 * hours;      
      }
  
      if (totalSeconds >= 60) {
        minutes = Math.floor(totalSeconds / 60);
        totalSeconds -= 60 * minutes;
      }
  
      seconds = totalSeconds;
      return    ("0" + minutes).slice(-2) +"m"+ "  " + ("0" +seconds).slice(-2)+"s";
     
       }
       showtime(){
         if(this.callstart==true)
         {
          return this.CallDuration(this.callstarttime)
         }
         else if(this.callstart==false)
         {
          return "00m 00s"

         }
       
       }
       // send user information 
       senduserInformation()
       {
        const user = JSON.parse(localStorage.getItem('gigaaa-user'));
        this.userFirstName=user.profile.first_name;
        this.userLastName=user.profile.last_name;
        this.userPicture=user.agent_images['original'];
         this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
       }
       // get peer data information
       getPeerDataInformation(data:any)
       {
         console.log(data)
        this.peerFirstname=data.first_name;
        this.peerLastname=data.last_name;
        this.peerPicture=data.img_url;
        this.peercamera=data.is_camera_on;
        if(data.is_shared_screen==true)
        { 
          this.peercamera=data.is_shared_screen;
        }
        this.peerscreenView=data.is_shared_screen;
     
        this.peerFirstnameinitials= this.peerFirstname.toUpperCase().charAt(0);
        this.peerLastnameinitials= this.peerLastname.toUpperCase().charAt(0);
        if(this.peerscreenView==true)
        {
          this.renderer.setStyle(this.remotevideo.nativeElement, "object-fit", "revert");
        }
        else 
        {
          this.renderer.setStyle(this.remotevideo.nativeElement, "object-fit", "cover");
        }
        if(this.hideContant==false)
        { this.hideContant=false;
          this.is_dragable=false;
          this.dialogRef.removePanelClass('minimizecallinterface');
          this.dialogRef.removePanelClass('callinterface-form-container');
          this.dialogRef.addPanelClass('maximizeVideocallinterface');
        }

       }
       // screen share to other peer

        private async screenShare(val):Promise<void>
        {
     
      
          if(val==true)
          {
           
              this.mediaDevices.getDisplayMedia({video: true,audio:true}).then(stream=>{
                this.screensharebtn=false;
                stream.getTracks()[0].addEventListener('ended',()=>{
                  this.screensharebtn=true;
                  if(this.camerabtn==true)
                  {
                 //   this.pausevideoCall();
                    this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
                  }
                  else if(this.camerabtn==false)
                  {
                    this.startvideoCall();
                    this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
  
                  }
                })

                if(this.camerabtn==false)
                {
                  this.pausevideoCall();
                  this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":true, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
                }
                
                navigator.mediaDevices.getUserMedia({audio:true}).then(audiostream=>{
                  const localAudio= audiostream.getAudioTracks()[0];
                  const videotrack= stream.getVideoTracks()[0];
                  this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":true, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
                  this.sharescreen=new MediaStream([videotrack,localAudio])
                  this.localVideo1.nativeElement.srcObject=undefined;
                  this.localVideo.nativeElement.srcObject=undefined;
                  this.localVideo1.nativeElement.srcObject= this.sharescreen;
                  this.localVideo.nativeElement.srcObject= this.sharescreen;
                  this.sharescreen.getTracks().forEach(track=>{
                    this.peerconnection.addTrack(track, this.sharescreen);
                  })
                  
                  }).then(async ()=>{
                  const offer:RTCSessionDescriptionInit=await this.peerconnection.createOffer({
                  offerToReceiveAudio:true,
                  offerToReceiveVideo:true,
                  iceRestart:true
                  });
                  await this.peerconnection.setLocalDescription(offer);
                  this.webrtcservice.sendDataforCall({user_id:this.peerUserid,data:offer, type: "offer" });
    
                  
                  })
                })
               // this.sharescreen=stream;
           
              }
              else 
              { 
                this.sharescreen.getVideoTracks().forEach(track=>{
                  this.screensharebtn=true;
                  track.stop();
                })
               // this.remotevideo.nativeElement.ownerDocument.body.style.setProperty("object-fit", "fill");
                if(this.camerabtn==false)
                {
                  this.startvideoCall();
                  this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})


                }
                else if(this.camerabtn==true)
                {
                 // this.pausevideoCall();
                  this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})

                }

               }
          

        }

}