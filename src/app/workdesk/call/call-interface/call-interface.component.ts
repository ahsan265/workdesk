import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { url } from 'inspector';
import { element, promise } from 'protractor';
import { MessageService } from 'src/app/service/messege.service';
import { webrtcsocket } from 'src/app/service/webrtcsocket';
import { environment } from 'src/environments/environment';
import { textChangeRangeIsUnchanged } from 'typescript';

const webrtcmediacontraints={
  audio:true,
  video:{width:226,height:144}
}
const webrtcmediacontraints_user={
   offerToReceiveAudio:true,
   offerToReceiveVideo:true,
}
@Component({
  selector: 'app-call-interface',
  templateUrl: './call-interface.component.html',
  styleUrls: ['./call-interface.component.css']
})
export class CallInterfaceComponent implements OnInit,AfterViewInit,OnDestroy  {

  localstream:MediaStream;
  peerconnection:RTCPeerConnection;
  @ViewChild ('localVideo',{static: true})  localVideo: ElementRef;
  @ViewChild ('remoteVideo',{static: true})  remotevideo: ElementRef;

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
     private webrtcservice:webrtcsocket,
     @Inject(MAT_DIALOG_DATA) public data,
     private message:MessageService) 
     {
     
   
     }

     ngOnInit(): void {

      this.webrtcservice.callUserSocket(this.data.call_uuid);
      this.addIncomingCallHandler();
    }
    //call the user 
    async callTheUser(): Promise<void>
    {
      await this.createPeerConnection();
     
    }
    // send offer to user 
   private async sendOffertoUser(id):Promise <any>
    {
      this.localstream.getTracks().forEach(track=>{
        console.log(track)
        this.peerconnection.addTrack(track,this.localstream);
        })
        try{
          const offer:RTCSessionDescriptionInit=await this.peerconnection.createOffer(webrtcmediacontraints_user);
          await this.peerconnection.setLocalDescription(offer);
          this.webrtcservice.sendDataforCall({type:"offer",data:offer,user_id:id});
        }
        catch(err)
        {
          this.message.setErrorMessage(err);
        }
    }
    // create peer fucntion 
    createPeerConnection()
    {
      this.peerconnection= new RTCPeerConnection({
        iceServers:[
          {
            urls: 'turn:13.81.45.178:3478?transport=tcp',  // A TURN server
            username: 'username',
            credential: 'password',
            credentialType: "password"
          },
          {
            urls: 'stun:stun.l.google.com:19302'
          }
        ],
        iceCandidatePoolSize: 10,
      });
      this.peerconnection.onicecandidate=this.handIceCandidateEvent;
      this.peerconnection.oniceconnectionstatechange=this.handleIceConnectionStateChangeEvent;
      this.peerconnection.onsignalingstatechange=this.handleSignalingStatetChangeEvent;
      this.peerconnection.ontrack=this.handleTrackEvent;
    }
    // close video call 
    closeVideoCall()
    {
      if(this.peerconnection)
      {
        this.peerconnection.onicecandidate=null;
        this.peerconnection.oniceconnectionstatechange=null;
        this.peerconnection.onsignalingstatechange=null;
        this.peerconnection.ontrack=null;
      }
      this.peerconnection.getTransceivers().forEach(transreiver=>{
        transreiver.stop();
      });
      this.localstream.getTracks().forEach(track=> {
        track.stop();
      });
      this.peerconnection.close();
      this.peerconnection=null;
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
      console.log(event);
      if(event.candidate)
      {
        this.webrtcservice.sendDataforCall({type:'ice-candidate',
        data:event.candidate});
      }
    }
    private handleIceConnectionStateChangeEvent=(event:Event)=>{
      console.log(event);
      switch(this.peerconnection.iceConnectionState)
      {
          case "closed":
          case "failed":
          case "disconnected":
            this.closeVideoCall();
            break;
      }
    }
    private handleSignalingStatetChangeEvent=(event:Event)=>{
      
      console.log(event);
      switch(this.peerconnection.signalingState)
      {
        case "closed":
          this.closeVideoCall();
          break;
      }
    }
    private handleTrackEvent=(event:RTCTrackEvent)=>{
      console.log(event);
      this.remotevideo.nativeElement.srcObject=event.streams[0];

    }
   ngAfterViewInit(): void {
    
      this._portal = new TemplatePortal(this._dialogTemplate, this._viewContainerRef);
      this._overlayRef = this._overlay.create({ positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
        hasBackdrop: true,
      });
      this._overlayRef.backdropClick().subscribe(()=>{
      });


      this.requestmediadevices();
      this.callTheUser();
  }
  // add incoming call handler
  addIncomingCallHandler()
  {
    // this.webrtcservice.callUserSocket();
    this.webrtcservice.callobject$.subscribe(msg=>{
      switch(msg.type)
      {

        case "offer":
          this.handleOfferMessage(msg.data);
          break;
        case "answer":
          this.handleAnswereMessage(msg.data);
          break;
        case "hangup":
          this.hanndleHangupMessage(msg.data);
          break;  
        case "ice-candidate":
          this.handleIceCandidateMessage(msg.data);
          break;
          case "user_id":
            this.sendOffertoUser(msg.id);
            break;
        default:
          console.log("Unknow Message :"+msg.type);    

      }
    },err=>{
      this.message.setErrorMessage(err);
    })
  }
  // message handler 
  private handleOfferMessage (msg:RTCSessionDescriptionInit)
  {
    if(!this.peerconnection)
    {
      this.createPeerConnection();
    }
    if(!this.localstream)
    {
      this.startvideoCall();
    }
    this.peerconnection.setRemoteDescription(new RTCSessionDescription(msg)).then(()=>{
      this.localVideo.nativeElement.srcObject=this.localstream;

      this.localstream.getTracks().forEach(track=>this.peerconnection.addTrack(track,this.localstream));
    }).then(()=>{
      return this.peerconnection.createAnswer();
    }).then((answere)=>{
      return this.peerconnection.setLocalDescription(answere);
    }).then(()=>{
      this.webrtcservice.sendDataforCall({type:"answer",data:this.peerconnection.localDescription});
    }).catch(this.handleError);

  }
  private handleAnswereMessage(data)
  {
    this.peerconnection.setRemoteDescription(data);
  }

  private hanndleHangupMessage(msg:Message)
  {
    this.closeVideoCall();
  }
  
  private handleIceCandidateMessage(data)
  {
    this.peerconnection.addIceCandidate(data).catch(this.reportError);
  }
  private reportError=(e:Error)=>
  {
    console.log("error-type: "+e.name);
    console.log(e);
  }
  // hang up the call ()
  hangupCall()
  {
    this.webrtcservice.sendDataforCall({type:"hangup",data:""});
    this.closeVideoCall();
  }
  // request video and audio 
  private async requestmediadevices(): Promise<void>
  {
    this.localstream=await navigator.mediaDevices.getUserMedia(webrtcmediacontraints);
    this.pausevideoCall();
  
  }
  changePosition() {
    this.dragPosition = {x: this.dragPosition.x , y: this.dragPosition.y};
  }
  
  ngOnDestroy() {
    this._overlayRef.dispose();
  }
  closecall()
  {

    this.webrtcservice.ws.close();
    this.closeVideoCall()
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
      this. startvideoCall();
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
      // this.localstream.getTracks().forEach(track=> {
      //   track.stop();
      // });
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

      startvideoCall()
      {
      this.localstream.getTracks().forEach(track=>{
        track.enabled=true;
      });
      this.localVideo.nativeElement.srcObject=this.localstream;
      }
      pausevideoCall()
      {
        this.localstream.getTracks().forEach(track=>{
          track.enabled=false;
        });
        this.localVideo.nativeElement.srcObject=undefined;
      }

    

}
