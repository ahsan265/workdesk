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
import { getTime } from 'ngx-bootstrap/chronos/utils/date-getters';
import { agentsocketapi } from 'src/app/service/agentsocketapi';
import { min, publish } from 'rxjs/operators';
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
  video:true
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

  @ViewChild ('localVideo')  localVideo: ElementRef<HTMLMediaElement>;
  @ViewChild ('localVideo1')  localVideo1: ElementRef<HTMLMediaElement>;
  @ViewChild ('dragarea')  dragarea: ElementRef;
      
  @ViewChild ('remoteVideo')  remotevideo: ElementRef<HTMLMediaElement>;
  @ViewChild ('remoteVideo1')  remotevideo1: ElementRef<HTMLMediaElement>;
  @ViewChild ('textforscreen') textforscreen:ElementRef;
  @ViewChild ('usercamera') usercamera:ElementRef;
  @ViewChild ('callcontrol') callcontrol:ElementRef;

  @ViewChild ('switchpanel') switchpanel:ElementRef;
  @ViewChild ('tooltip') tooltip:ElementRef;


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
 startstats:any;
 callQualityIndicator:any;

 ismousemove:boolean=true;

 inputMicrophone=[];
 outputSpeaker=[];
 videoInputDevice=[];
 inputDeviceid:any;
 outputDeviceid:any;
 showSwitcher:boolean=true;
 showtooltiptext:any;
 remotetrackEvent:MediaStream;

 lastuserdSpeaker:any;
 lasyuserspearkerID:any

      constructor(private changeDetector: ChangeDetectorRef,
     public dialogRef: MatDialogRef<CallInterfaceComponent>,
     private webrtcservice:webrtcsocket,
     @Inject(MAT_DIALOG_DATA) public data,
     private renderer: Renderer2,
        private message:MessageService) 
        { 
          this.callQualityIndicator='../../../../assets/assets_workdesk/red.svg'
        
          this.detectDevices();

          // this.renderer.listen(this.dragarea.nativeElement, 'click', e=>{
          //   this.showSwitcher=true;
          //   this.renderer.setStyle(this.switchpanel.nativeElement, "display", "none");
          // })
        }
        // request video and audio 
        private async requestmediadevices(val:any): Promise<void>
        {
          try {
          this.localstream=await navigator.mediaDevices.getUserMedia(val)
          this.localstream.getAudioTracks().forEach(track => {
            track.enabled=true;
          });
          this.localstream.getVideoTracks().forEach(track => {
            track.enabled=false;
            track.stop();
          });
        
          //this.showListofDevices(1);

           this.localVideo.nativeElement.srcObject = undefined;
           this.localVideo1.nativeElement.srcObject = undefined;
           this.localVideo.nativeElement.srcObject=this.localstream; 
           this.localVideo1.nativeElement.srcObject=this.localstream; 
           const callstat=JSON.parse(localStorage.getItem("call_info"))
            if(callstat.is_refreshed!=true)
            {
              this.showListofDevices(1);
              console.log("hellomic")
            }
            else{
             this.showListofDevices(0).finally(()=>{
              this.restoreLastUsedDevices(1);
             })
             
            }
          

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
            this.showUserInformation();
            this.addIncomingCallHandler();
            const callstat=JSON.parse(localStorage.getItem("call_info"))
            if(callstat==null)
            {
              this.webrtcservice.callUserSocket(this.data.call_uuid,"","");
            }
            else 
            {
              this.webrtcservice.callUserSocket(this.data.call_uuid,callstat?.user_id,callstat?.is_refreshed);
            }
         
          interval(1000).subscribe(() => {
            if (!this.changeDetector['destroyed']) {
              this.changeDetector.detectChanges();
            }
          });
           this.changeDetector.detectChanges();
          // this.CallDuration()
         
        }

        @HostListener('document:mousemove', ['$event'])
        onMouseDown(event) {
          let  timeout;
          this.renderer.listen(this.dragarea.nativeElement, 'mousemove', e => {
            if(this.peerscreenView==true)
            {            
              this.renderer.setStyle(this.usercamera.nativeElement, "z-index", "2");
              this.renderer.setStyle(this.usercamera.nativeElement, "display", "flex");
              this.renderer.setStyle(this.usercamera.nativeElement, "transform", "translatex(-150%)");
              this.renderer.setStyle(this.usercamera.nativeElement, "transform", "unset");
              this.renderer.setStyle(this.usercamera.nativeElement, "transition", "0.5s");
             // this.renderer.setStyle(this.usercamera.nativeElement, "transition", "all 0.3s");
             this.renderer.setStyle(this.callcontrol.nativeElement, "z-index", "2");
              this.renderer.setStyle(this.callcontrol.nativeElement, "display", "inline-block");
              this.renderer.setStyle(this.callcontrol.nativeElement, "transform", "translatey(150%)");
              this.renderer.setStyle(this.callcontrol.nativeElement, "transform", "unset");
              this.renderer.setStyle(this.callcontrol.nativeElement, "transition", "0.5s");
             // this.renderer.setStyle(this.callcontrol.nativeElement, "transition", "all 0.3s");
            }
            clearTimeout(timeout);
            timeout= setTimeout(()=>{
              this.mouseStopped();
            },5000);
          });
          
        }        
        mouseStopped()
        {
          if(this.peerscreenView==true)
          { 
            this.renderer.setStyle(this.usercamera.nativeElement, "display", "flex");
            if(this.hideContant==false)
            {
              this.renderer.setStyle(this.usercamera.nativeElement, "transform", "translatex(0%)");

            }
            else{
              this.renderer.setStyle(this.usercamera.nativeElement, "transform", "translatex(-150%)");
            }
            this.renderer.setStyle(this.usercamera.nativeElement, "z-index", "-1");
            this.renderer.setStyle(this.usercamera.nativeElement, "transition", "0.5s");
            this.renderer.setStyle(this.callcontrol.nativeElement, "display", "inline-block");
            if(this.hideContant==false)
            {
              this.renderer.setStyle(this.callcontrol.nativeElement, "transform", "translatey(0%)");

            }
            else{
              this.renderer.setStyle(this.callcontrol.nativeElement, "transform", "translatey(150%)");

            }
            this.renderer.setStyle(this.callcontrol.nativeElement, "z-index", "-1");
            this.renderer.setStyle(this.callcontrol.nativeElement, "transition", "0.5s");

            //this.renderer.setStyle(this.callcontrol.nativeElement, "transition", "all 0.3s");
          }
        }
       
        showUserInformation()
        {
          const user = JSON.parse(localStorage.getItem('gigaaa-user'));
          this.userFirstName=user.profile.first_name;
          this.userLastName=user.profile.last_name;
         // this.userPicture=user.agent_images['96'];
            this.userPicture=user.avatar_url;
          this.firstuserFirstName= this.userFirstName.toUpperCase().charAt(0);
          this.firstuserLastName= this.userLastName.toUpperCase().charAt(0)

        }

        // send offer to user  and call 
           private async createOfferForPeer():Promise <void>
                 {
                if(!this.peerconnection)
                {
                 await this.createPeerConnection()
                }
               //   await this.startvideoCall();
               //   await this.pausevideoCall();
                 navigator.mediaDevices.getUserMedia({audio:true,video:false}).then((stream)=>{
                 this.localstream=stream;
                 console.log(this.localstream);
                const videotrack=stream.getAudioTracks();
                this.localVideo.nativeElement.srcObject = undefined;
                this.localVideo1.nativeElement.srcObject= undefined;
                this.localVideo1.nativeElement.srcObject=this.localstream;
                this.localVideo.nativeElement.srcObject=this.localstream;
                this.localstream=new MediaStream([videotrack[0]])
              //  this.localstream.addTrack(videotrack[0]);
              this.localstream.getTracks().forEach(track=>{
                this.peerconnection.addTrack(track,this.localstream);
              })
                }).then(async ()=>{
                    const offer:RTCSessionDescriptionInit=await this.peerconnection.createOffer({
                    offerToReceiveAudio:true,
                    offerToReceiveVideo:true,
                    iceRestart:true
                  });
                  await this.peerconnection.setLocalDescription(offer).catch(err=>{
                    console.log(err)
                  });
                  console.log(offer);
               //   this.getLastOfferforUser(this.localoffer);
                  this.webrtcservice.sendDataforCall({ type: "offer",user_id:this.peerUserid,data:offer});
                 
                  })
                 
             
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
      var options={optional:[{DtlsSrtpKeyAgreement: true}]};

    this.peerconnection= new RTCPeerConnection({
     
          iceServers:[
            {
              urls: 'stun:stun.l.google.com:19302',
            },
            {
              urls: 'turn:openrelay.metered.ca:80',  // A TURN server
              username: 'openrelayproject',
              credential: 'openrelayproject',
            },
            {
              urls: "turn:turn.gigaaa.com:80 ",
              username: "username",
              credential: "password",
            },
            {
              urls: "turn:turn.gigaaa.com:443 ",
              username: "username",
              credential: "password",
            },
            {
              urls: "turn:turn.gigaaa.com:443?transport=tcp ",
              username: "username",
              credential: "password",
            },
              {
                urls: "turn:turn.gigaaa.com:3478",
                username: "username",
                credential: "password",
              },
              {
                urls: "turn:turn.gigaaa.com:3478?transport=tcp ",
                username: "username",
                credential: "password",
              },
              {
                urls: "turns:turn.gigaaa.com:3478?transport=tcp ",
                username: "username",
                credential: "password",
              },
           
        ],
        iceTransportPolicy:'all',
      })
      this.message.setSuccessMessage("Peer connection");
      this.eventHandlerforpeer();
          // this.startstats=  setInterval(()=>{
          // this.indicatorfunction(this.peerconnection,this.localstream.getTracks()[0]);
          //   },10000)
    
    }
    
    // event handler for peerconnection 
    eventHandlerforpeer()
    {
      this.peerconnection.onicecandidate= this.handIceCandidateEvent;
      this.peerconnection.oniceconnectionstatechange=this.handleIceConnectionStateChangeEvent;
      this.peerconnection.onsignalingstatechange=this.handleSignalingStatetChangeEvent;
      this.peerconnection.ontrack=this.handleTrackEvent;
    }
    // close video call 
  private   closeVideoCall()
    {
      // this.localstream.getTracks().forEach(track=> {
      //   track.stop();
      //   this.peerconnection.close();
      //   this.peerconnection=null;
   
      // });
      // if(this.sharescreen!=undefined)
      // {
      //   this.sharescreen.getTracks().forEach(track=>{
      //     track.stop();
      //   })
      // }
      clearInterval(this.startstats)
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
      console.log(event)
      if(event.candidate!=null)
      {
        if(event.candidate.type=='relay')
        {
          this.webrtcservice.sendDataforCall({type:'ice-candidate',
          data:event.candidate});
        }
        else 
        {
          this.webrtcservice.sendDataforCall({type:'ice-candidate',
          data:event.candidate});
        }
      
      }
     


    }
    private handleIceConnectionStateChangeEvent=async (event:Event)=>{
      console.log(event)
      switch(this.peerconnection.iceConnectionState)
      {
        case "closed":
          this.peerconnection.close()
          this.peerconnection=null;
          await this.createPeerConnection();
          this.getcallTypeforPagereload();
        break;
        case "failed":
        case "disconnected":
        this.peerconnection.close()
       this.peerconnection=null;
       await this.createPeerConnection();
       this.getcallTypeforPagereload();
        break;
      }
    }
    private handleSignalingStatetChangeEvent=async (event:Event)=>{
      console.log(event)

      switch(this.peerconnection.signalingState)
      {
           case "closed":
         this.peerconnection.close()
         this.peerconnection=null;
         await this.createPeerConnection();
         this.getcallTypeforPagereload();
          break;
      }
    }
      private handleTrackEvent=(event:RTCTrackEvent)=>{
        console.log(event);
        this.getLastOfferforpeer(event.streams[0]);
        this.remotetrackEvent= event.streams[0]; 
        this.remotevideo.nativeElement.srcObject= event.streams[0]; 
       this.restoreLastUsedDevices(0);   
      }
  
   
      ngAfterViewInit(): void {
        this.requestmediadevices(this.webrtcmediacontraints);
        this.createPeerConnection();
       

      }
  // add incoming call handler
      addIncomingCallHandler()
      {
        this.webrtcservice.callobject$.subscribe(async (msg:any)=>{
          let callstat= await JSON.parse(localStorage.getItem("call_info"));

        switch(msg.type)
        {
          case "offer":
            console.log(msg.data)
            if(msg.data!=undefined)
            {
             // this.getLastOfferforofpeer(msg.data)
              await  this.handleOfferMessage(msg.data);
            }
           
            
            
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
          this.userid=msg.id;
          if(callstat?.is_refreshed!=true)
          {
            localStorage.setItem("call_info",JSON.stringify({user_id:this.userid,is_refreshed:false}));
            this.saveuserFirstinformation();
          }
          else{
            this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":callstat?.user_devices_info.data})
          }
          break;
          case "accept":
      
              this.peerUserid=msg.user_id;
            if(callstat?.is_refreshed==true)
            {  
            if(!this.peerconnection)
            {
                await this.createPeerConnection()
            }
             await this.getcallTypeforPagereload();
             this.getPeerDataInformation(callstat?.peer_devices_info);
            //  if(callstat.peer_devices_info.data.is_shared_screen==true)
            //  {
            //    await  this.handleOfferMessage(callstat?.peer_last_offer);
            //  }
             this.callstart=true;
             this.callstarttime=callstat?.last_duration;
             }
             else{
               console.log("userinfor")
           this.senduserInformation();
            await this.createOfferForPeer(); 
            this.callstart=true;
            this.callstarttime=new Date().getTime();
            callstat['last_duration']=this.callstarttime;
            localStorage.setItem("call_info",JSON.stringify(callstat));
            callstat['is_refreshed']=true;
            localStorage.setItem("call_info",JSON.stringify(callstat));
            
          }
        
         
          break;
          case "peer_data":
            console.log(msg)
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
          }).then(async () => {
            // Build SDP for answer message
            return await this.peerconnection.createAnswer();
          }).then(async (answer) => {
            // Set local SDP
          return await this.peerconnection.setLocalDescription(answer);

          }).then(() => {
            this.webrtcservice.sendDataforCall({type:"answer",data:this.peerconnection.localDescription});
          }).catch(err=>{
            console.log(err)
          });

        }
        private async handleAnswereMessage(data:RTCSessionDescriptionInit): Promise<void>
        { 
          console.log(data)
          await this.peerconnection.setRemoteDescription(new RTCSessionDescription(data)).catch(err=>{
          console.log(err)
          })
        }

        private hanndleHangupMessage(msg:Message)
        {
          this.hangupCall();
        }
  
        private async  handleIceCandidateMessage(data:RTCIceCandidate): Promise<void>
        { 
          console.log(data)
          if (data.candidate) {
          await  this.peerconnection.addIceCandidate(data).catch(err=>{
            console.log(err)
          });
       
        }
        }

        // hang up the call ()
        closeStream()
        {
          localStorage.removeItem("call_info");
          this.localstream.getTracks().forEach(track=>{
            track.enabled=false;
            track.stop();
          })
          if(this.screensharebtn==false)
          {
            this.sharescreen.getTracks().forEach(track=>{
              track.enabled=false;
              track.stop();
            })
          }
        }
        hangupCall()
        {
           this.closeStream() ;
          this.peerconnection.close();
          this.peerconnection=null;
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
                if(this.peerscreenView==true)
                {
                  this.peercamera=false;
                }

        
              }
            }
            else {
              this.camerabtn=true;
              this.cameraIcon="../../../assets/assets_workdesk/camera_off.svg";
              this.pausevideoCall();
              if(this.is_dragable==false)
              {
                if(this.peercamera==false&&this.peerscreenView==false)
                {
                  this.dialogRef.removePanelClass('maximizeVideocallinterface');
                  this.dialogRef.addPanelClass('minimizecallinterface');
                }
                 
                  if(this.peerscreenView==true)
                  {
                    this.peercamera=true;
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
          if(this.peerscreenView==false && this.peercamera==true)
          {
            this.dialogRef.addPanelClass('maximizeVideocallinterface');
            this.hidecamera=false;
        
          }
          else if(this.camerabtn==false)
          {
            this.dialogRef.addPanelClass('maximizeVideocallinterface');

          }
          else 
          { this.dialogRef.addPanelClass('minimizecallinterface');
            this.hidecamera=true;
          }
           this.unsplitIcon='../../../../assets/assets_workdesk/split_icon12.svg';
           this.splitIcon='../../../../assets/assets_workdesk/smallscreen_icon12.svg'
          
           this.hideScreen(this.peerscreenView);
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
          this.hideScreen(false);

        }
        
     
        }
   
      private async  startvideoCall() :Promise<void>
      {          
            this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
            this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
        // this.webrtcmediacontraints.video=this.hasVideoparam; 
         navigator.mediaDevices.getUserMedia({audio:true,video:this.hasVideoparam}).then((stream)=>{
         this.localstream=stream;
          const videotrack=stream.getVideoTracks();
          const audiotrack=stream.getAudioTracks();
           this.localstream=new MediaStream([videotrack[0],audiotrack[0]])
            this.localVideo.nativeElement.srcObject = undefined;
            this.localVideo1.nativeElement.srcObject= undefined;
            this.localVideo1.nativeElement.srcObject=this.localstream;
            this.localVideo.nativeElement.srcObject=this.localstream;
          //  this.localstream.addTrack(videotrack[0]);
            this.localstream.getTracks().forEach(track=>{
              this.peerconnection.addTrack(track,this.localstream);
            })
          }).then(async ()=>{
          const offer:RTCSessionDescriptionInit=await this.peerconnection.createOffer({
            offerToReceiveAudio:true,
            offerToReceiveVideo:true,
            iceRestart:true
          });
          await this.peerconnection.setLocalDescription(offer).catch(err=>{
            console.log(err)
          })
         // this.localoffer=offer;
        //  this.getLastOfferforUser(offer);
          this.webrtcservice.sendDataforCall({type: "offer",user_id:this.peerUserid,data:offer  });

        })
       
        
      }
          private async   pausevideoCall() :Promise<void>
          {      
           if(this.localstream)
           {
            this.localstream.getVideoTracks().forEach(track=>{
              track.enabled=false;
              track.stop();
            })
           }
             
            this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
            this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
            // this.webrtcmediacontraints.video=false; 
           await   navigator.mediaDevices.getUserMedia({audio:true,video:false}).then((stream)=>{
            this.localstream=stream;
            const videotrack=stream.getAudioTracks();
            this.localVideo.nativeElement.srcObject = undefined;
            this.localVideo1.nativeElement.srcObject= undefined;
            this.localVideo1.nativeElement.srcObject=this.localstream;
            this.localVideo.nativeElement.srcObject=this.localstream;
            // this.localstream=new MediaStream([videotrack[0]])
            this.localstream.addTrack(videotrack[0]);
              this.peerconnection.addTrack(videotrack[0],this.localstream);
            }).then(async ()=>{
                const offer:RTCSessionDescriptionInit=await this.peerconnection.createOffer({
                offerToReceiveAudio:true,
                offerToReceiveVideo:true,
                iceRestart:true
              });
              await this.peerconnection.setLocalDescription(offer).catch(err=>{
                console.log(err)
              });
            //  this.localoffer=offer;
             
              this.webrtcservice.sendDataforCall({ type:"offer" ,user_id:this.peerUserid,data:offer});
             // this.getLastOfferforUser(offer);
                })
             }

            splitScreen(val:any)
                {
                if(val==true)
                {
                this.splitscreen=false;
                this.changePosition();
                if(this.peerscreenView==true)
                {
                  this.renderer.setStyle(this.remotevideo.nativeElement, "top", "80px");
      

                }
                }
                else if(val==false)
                { 
                this.splitscreen=true;
                if(this.peerscreenView==true)
                {
                  this.renderer.setStyle(this.remotevideo.nativeElement, "top", "50px");


                }
           
                
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
        this.userPicture=user.avatar_url;
        this.userPicture=user.avatar_url;
        this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
        }
        saveuserFirstinformation()
        {
          const user = JSON.parse(localStorage.getItem('gigaaa-user'));
        this.userFirstName=user.profile.first_name;
        this.userLastName=user.profile.last_name;
        this.userPicture=user.avatar_url;
        this.userPicture=user.avatar_url;
        console.log(this.userFirstName,this.userLastName);
        this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
        }

       // get peer data information
       getPeerDataInformation(data:any)
       {
         console.log(data)
        this.peerFirstname=data.first_name;
        this.peerLastname=data.last_name;
        this.peerPicture=data.img_url;
        this.peercamera=data.is_camera_on;
      
        // if(data.is_shared_screen==true)
        // { 
        //   this.peercamera=data.is_shared_screen;
        // }
        this.peerscreenView=data.is_shared_screen;
        this.peerFirstnameinitials= this.peerFirstname.toUpperCase().charAt(0);
        this.peerLastnameinitials= this.peerLastname.toUpperCase().charAt(0);
        if(this.peerscreenView==true)
        {
          this.renderer.setStyle(this.remotevideo.nativeElement, "object-fit", "revert");
          this.hideScreen(this.peerscreenView);

        }
        else 
        {
          this.renderer.setStyle(this.remotevideo.nativeElement, "object-fit", "cover");
        }
        if(this.hideContant==false)
        { this.hideContant=false;
          this.is_dragable=false;
          // this.dialogRef.removePanelClass('minimizecallinterface');
          // this.dialogRef.removePanelClass('callinterface-form-container');
          // this.dialogRef.addPanelClass('maximizeVideocallinterface');
          // this.renderer.setStyle(this.remotevideo.nativeElement, "display", "block");

        //  this.hideScreen(this.peerscreenView);
          console.log("hello")
            this.hideScreen(this.peerscreenView);
      

        }

        this.peerdeviceinfo(data);
        if(this.peerscreenView!=false)
        {
          this.renderer.setStyle(this.usercamera.nativeElement, "display", "none");
         // this.renderer.setStyle(this.usercamera.nativeElement, "animation-delay", "0.4s");
          this.renderer.setStyle(this.callcontrol.nativeElement, "display", "none");
         // this.renderer.setStyle(this.callcontrol.nativeElement, "animation-delay", "0.4s");
        }
        else{
        this.renderer.setStyle(this.usercamera.nativeElement, "z-index", "2");
        this.renderer.setStyle(this.usercamera.nativeElement, "display", "flex");
        this.renderer.setStyle(this.usercamera.nativeElement, "transform", "unset");
        this.renderer.setStyle(this.usercamera.nativeElement, "transform", "unset");
        this.renderer.setStyle(this.usercamera.nativeElement, "transition", "0.3s");
       // this.renderer.setStyle(this.usercamera.nativeElement, "transition", "all 0.3s");
       this.renderer.setStyle(this.callcontrol.nativeElement, "z-index", "2");
        this.renderer.setStyle(this.callcontrol.nativeElement, "display", "inline-block");
        this.renderer.setStyle(this.callcontrol.nativeElement, "transform", "unset");
        this.renderer.setStyle(this.callcontrol.nativeElement, "transform", "unset");
        this.renderer.setStyle(this.callcontrol.nativeElement, "transition", "0.3s");
        }
       }
       // screen share to other peer

        private async screenShare(val):Promise<void>
        {
     
      
          if(val==true)
          {
           
              this.mediaDevices.getDisplayMedia({video:true}).then(stream=>{
                this.screensharebtn=false;
                stream.getTracks()[0].addEventListener('ended',()=>{
                  this.toggleViewForSharescree(false);

                  this.screensharebtn=true;
                  if(this.camerabtn==true)
                  {
                 //   this.pausevideoCall();
                    this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
                    this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})

                  }
                  else if(this.camerabtn==false)
                  {
                    this.startvideoCall();
                    this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
                    this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})

                  }
                })

                if(this.camerabtn==false)
                {
                  this.pausevideoCall();
                  this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":true, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
                }
                
                navigator.mediaDevices.getUserMedia({audio:true}).then(audiostream=>{
                  this.toggleViewForSharescree(true);
                  const localAudio= audiostream.getAudioTracks()[0];
                  const videotrack= stream.getVideoTracks()[0];
                  this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":true, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
                  this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":true, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})

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
                 //  this.localoffer=offer;
                 // this.getLastOfferforUser(this.localoffer);
                  this.webrtcservice.sendDataforCall({type: "offer" ,user_id:this.peerUserid,data:offer });
                  })
                })
                
              }
              else 
              { 
                this.sharescreen.getVideoTracks().forEach(track=>{
                  this.toggleViewForSharescree(false);
                  this.screensharebtn=true;
                  track.stop();
                })
                if(this.camerabtn==false)
                {
                  this.startvideoCall();
                  this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
                  this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
                }
                else if(this.camerabtn==true)
                {
                  this.pausevideoCall();
                  this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
                  this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture}})
                }
               }
            }
   
        // set user info
        setUserInfo(data:any)
        {          
          console.log(data)
          let callstat=JSON.parse(localStorage.getItem("call_info"));
          callstat['user_devices_info']=data;
          console.log(callstat)
          localStorage.setItem("call_info",JSON.stringify(callstat));
          

        }
        // set peer device info
        peerdeviceinfo(data:any)
        {          
          console.log(data)
          let callstat=JSON.parse(localStorage.getItem("call_info"));
          callstat['peer_devices_info']=data;
          localStorage.setItem("call_info",JSON.stringify(callstat));

        }
        // get last offer for user
        getLastOfferforpeer(data:any)
        {          
          console.log(data)
          let callstat=JSON.parse(localStorage.getItem("call_info"));
          callstat['peer_last_offer']=data;
          localStorage.setItem("call_info",JSON.stringify(callstat));

        }
    
 
         //refres state of calls
        private async getcallTypeforPagereload():Promise<void>
         {
          let callstat=JSON.parse(localStorage.getItem("call_info"));
          if(callstat.user_devices_info?.data.is_camera_on==true&&callstat.user_devices_info?.data.is_shared_screen==false)
          {
            this.camerabtncheck(true)

          }
          else if(callstat.user_devices_info?.data.is_camera_on==true&&callstat.user_devices_info?.data.is_shared_screen==true)
          { 
            
         
          if(this.sharescreen)
          {
            this.sharescreen.getTracks().forEach(track=>{
              this.peerconnection.addTrack(track, this.sharescreen);
            })
            const offer:RTCSessionDescriptionInit=await this.peerconnection.createOffer({
            offerToReceiveAudio:true,
            offerToReceiveVideo:true,
            iceRestart:true
            });
            await this.peerconnection.setLocalDescription(offer);
            this.webrtcservice.sendDataforCall({type: "offer" ,user_id:this.peerUserid,data:offer });
          }
          else{
              this.camerabtncheck(false);

          }
        
          }
           else if(callstat.user_devices_info?.data.is_camera_on==false&&callstat.user_devices_info?.data.is_shared_screen==false)
          {
            this.camerabtncheck(false)
    
          }
          
          
         }
         // restore last used device ()
         
         restoreLastUsedDevices(val)
         {
          let callstat=JSON.parse(localStorage.getItem("call_info"));
          if(callstat.is_refreshed==true)
          {
            if(val==1)
            {
              this.selectMicrophone(callstat?.user_last_mic,1);
              console.log("restore mice")
            }
            else if(val==0)
            {
              this.selectSpeaker(callstat?.user_last_speaker);
            }
          }

         }
         CallQualityIndicator(val:any)
         {
          if(val<1)
          {
            this.callQualityIndicator='../../../../assets/assets_workdesk/green.svg'
          }
          else if(val>=1 && val<2)
          {
            this.callQualityIndicator='../../../../assets/assets_workdesk/yellow.svg'
          }
          else if(val>2)
          {
            this.callQualityIndicator='../../../../assets/assets_workdesk/red.svg'
          }
         }
         
         indicatorfunction(peer,track)
         {
           console.log(peer,track)
           if(peer!=undefined&&track!=undefined)
           {
            peer.getStats(track).then(result=>{
              result.forEach(data=>{
                console.log(data)
                if(data.type=="remote-inbound-rtp")
                {
                  this.CallQualityIndicator(data.jitter);
                }
              })
              })
           }
         }
          // hide the screeen share 
          hideScreen(val)
          {
            console.log(val)
            if(val==true)
            {
              this.peercamera=true;
              // this.renderer.setStyle(this.remotevideo.nativeElement, "visibility", "v");
              this.renderer.setStyle(this.textforscreen.nativeElement, "display", "block");

              
            }
            else if(val==false)
            {
              this.renderer.setStyle(this.remotevideo.nativeElement, "visibility", "visible");
            //  this.renderer.setStyle(this.remotevideo.nativeElement, "visibility", "block");
              this.renderer.setStyle(this.textforscreen.nativeElement, "display", "none");
            }
          }

          getArray(number:any)
          {
            return Array(number);
          }
          // select microphone options 
          async selectMicrophone(Val,isLoad)
          {  
                console.log(Val)  
            this.inputDeviceid = Val.data.deviceId;
            await  navigator.mediaDevices.enumerateDevices();
           
            let updateddata=this.setDefaultDevice(this.inputMicrophone,Val.data.label);
            this.inputMicrophone=updateddata;
            if(isLoad==1)
            {
             await this.runtheMicrophone(Val.data.deviceId);
             this.getLastUsedMicrophone(Val);

            }

          }
         private  async runtheMicrophone(micename):Promise<void>
          {
            let  constraint={audio:{  deviceId :micename }};
              
            if (this.localstream) {
             this.localstream.getAudioTracks().forEach(track => {
               track.stop()
             });
            }
            await navigator.mediaDevices.getUserMedia(constraint).then(async stream=>{
             this.showMicroPhoneLevels(micename, stream);
           navigator.mediaDevices.ondevicechange=null
           let audiotrk=    stream.getAudioTracks()[0];
           this.localstream=new MediaStream([audiotrk])
           let audioupdt=this.peerconnection.getSenders().find(trk=>{
             return trk.track.kind==audiotrk.kind;
            })
            
            audioupdt.replaceTrack(audiotrk);

           }).catch(err=>{
             console.log(err)
           })
          }
          // select speaker options 
        private async   selectSpeaker(Val):Promise<void>
          { 
            console.log(Val)
            if(this.remotetrackEvent )
            {
              this.getLastUsedSpeaker(Val);
              if(this.lastuserdSpeaker!=undefined)
              { this.remotevideo.nativeElement.appendChild(this.lastuserdSpeaker);
                 this.remotevideo.nativeElement.childNodes.forEach(data=>{
                  console.log(data)
                   this.remotevideo.nativeElement.removeChild(data)

                 })

              }
            
              this.outputDeviceid=Val.data.deviceId;
              
              let  mediaStream = this.remotetrackEvent;
              let  test_audio_context1 = new AudioContext();
              let webaudio_source1 = test_audio_context1.createMediaStreamSource(mediaStream);
              let webaudio_ms1 = test_audio_context1.createMediaStreamDestination();
              webaudio_source1.connect(webaudio_ms1);
              let  test_output_audio1 = <HTMLMediaElement & { setSinkId (deviceId: string): void }> new Audio();
              test_output_audio1.srcObject  = webaudio_ms1.stream;
              test_output_audio1.play();
              test_output_audio1.setSinkId(this.outputDeviceid);
              this.remotevideo.nativeElement.replaceWith(test_output_audio1);
             // this.remotevideo.nativeElement.appendChild(test_output_audio1);
               this.lastuserdSpeaker=test_output_audio1;
              let updateddata=this.setDefaultDevice(this.outputSpeaker,Val.data.label);
              this.outputSpeaker=updateddata;

            }
            await  navigator.mediaDevices.enumerateDevices();
         
          }
         
 
          setDefaultDevice(devices:Array<any>,selecteddeviceid:any)
          {
            let devicesData=[];
            devices.forEach(element => {
              if(element.selected==true)
              {
                element.selected=false
              }
              if(element.data.label==selecteddeviceid)
              {
                element.selected=true;
                devicesData.push(element);
              }
              else{
                devicesData.push(element);
              }
            });
            console.log(devicesData);
            return devicesData;
          }
          // show the list of devices input output 
       private async showListofDevices(isload:any)
          {

            let inputDevice=[];
            let outputDevice=[];
            let videoInputDevice=[];
            let devicename;
            navigator.mediaDevices.enumerateDevices().then( devices=>{
              console.log(devices)
              devices.forEach(async device=>{
              if(device.kind== "audioinput")
              {
                if(device.deviceId=="default")
                {
                  devicename=device.label;
                  inputDevice.push({data:device,selected:true});
                  // if (this.localstream) {
                  //   this.localstream.getTracks().forEach(track => {
                  //     track.stop();
                  //   });
                  // }
              
                  let callstat=JSON.parse(localStorage.getItem("call_info"));
                  if(callstat.is_refreshed!=true)
                  {
                    await this.selectMicrophone({data:device,selected:true},isload)
                    this.getLastUsedMicrophone({data:device,selected:true});
                  }
                  
                 
                }
                else{
                  inputDevice.push({data:device,selected:false});
                }
              }
              else if(device.kind=="audiooutput")
              {
                if(device.deviceId=="default")
                {
                  outputDevice.push({data:device,selected:true});
                // await  this.selectSpeaker({data:device,selected:true},1);
                this.lasyuserspearkerID={data:device,selected:true}
                let callstat=JSON.parse(localStorage.getItem("call_info"));
                  if(callstat.is_refreshed!=true)
                  {
                    this.getLastUsedSpeaker(this.lasyuserspearkerID);
                  }

                }
                else{
                  outputDevice.push({data:device,selected:false});
                }

              }
              else if(device.kind=="videoinput")
              {
                videoInputDevice.push({data:device,selected:false})
              }
           
              })

            })
          this.inputMicrophone=inputDevice;
            this.outputSpeaker=outputDevice;
            this.videoInputDevice=videoInputDevice;
  
          
          }
          // get last user speakers
          getLastUsedSpeaker(data)
          {
            console.log(data)
            let callstat=JSON.parse(localStorage.getItem("call_info"));
            callstat['user_last_speaker']=data;
            localStorage.setItem("call_info",JSON.stringify(callstat));
          }
          // get last user microphone
          getLastUsedMicrophone(data)
          {
            console.log(data)
            let callstat=JSON.parse(localStorage.getItem("call_info"));
            callstat['user_last_mic']=data;
            localStorage.setItem("call_info",JSON.stringify(callstat));
          }
          // detect devices 
       private async   detectDevices():Promise<void>
          {  
            navigator.mediaDevices.addEventListener('devicechange', async () => {
           await    this.showListofDevices(0);

            })
          }
          // show microphone levels 
          async showMicroPhoneLevels(mic_name, stream)
          {  
           
           let audioContext = new AudioContext()
            await audioContext.audioWorklet.addModule('/assets/vumeter.js')
            let microphone = audioContext.createMediaStreamSource(stream)
            const node = new AudioWorkletNode(audioContext, 'vumeter');
            microphone.connect(node).connect(audioContext.destination)

            node.port.onmessage=((event)=>{
              let _volume = 0
              let _sensibility = 5
              if (event.data.volume)
              {
                _volume = event.data.volume;
                  let avg= _volume*100;
                  this.showcoloronbars(avg,mic_name);

              }
            })
         
                }
             
            
              
         
          // show color pids 
          showcoloronbars(avgsound,mic_name)
          {
              const allPids =Array.from(document.querySelectorAll(".voicebars"+mic_name) as unknown as Array<HTMLElement>)
                const numberOfPidsToColor = Math.round(avgsound / 2);
                const pidsToColor = allPids.slice(0, numberOfPidsToColor);
                for (const pid of allPids) {
                    pid.style.backgroundColor = "#3A4559";
                }
                for (const pid of pidsToColor) {
                  pid.style.backgroundColor = "#76CB09";
                }
            
                this.inputDeviceid=mic_name
           
          }
     
       
            showswitcher(val)
            {
              if(val==true)
              {
                this.showSwitcher=false;
                this.renderer.setStyle(this.switchpanel.nativeElement, "display", "block");
              }
              else if(val==false)
              {                
                this.showSwitcher=true;
                this.renderer.setStyle(this.switchpanel.nativeElement, "display", "none");
              }
             

             
            }

            // show tooltip on devices 
            showtooltip(val)
            {
              this.showtooltiptext=val
            }
            // hide tooltip ond devices 
            hidetooltip(val){
              this.showtooltiptext=""
            }


            toggleViewForSharescree(val)
            {
              if(val==true)
              {
                this.renderer.setStyle(this.localVideo1.nativeElement, "object-fit", "revert");

              }
              else{
                this.renderer.setStyle(this.localVideo1.nativeElement, "object-fit", "cover");

              }
            }
         
}