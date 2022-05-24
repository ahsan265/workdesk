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
import { min, publish, retry } from 'rxjs/operators';
import { ThemeService } from 'ng2-charts';
import { async } from '@angular/core/testing';
import { Stream } from 'stream';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { dayOfYearFromWeeks } from 'ngx-bootstrap/chronos/units/week-calendar-utils';




@Component({
  selector: 'app-call-interface',
  templateUrl: './call-interface.component.html',
  styleUrls: ['./call-interface.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class CallInterfaceComponent implements OnInit,AfterViewInit,OnDestroy  {  
  iceserversConfigs=[
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    {
      urls: "turn:turn.gigaaa.com:80",
      username: "username",
      credential: "password",
    },
    {
      urls: "turn:turn.gigaaa.com:443",
      username: "username",
      credential: "password",
    },

    // {
    //   urls: "turn:turn.gigaaa.com:443?transport=tcp ",
    //   username: "username",
    //   credential: "password",
    // },
    //   {
    //     urls: "turn:turn.gigaaa.com:3478",
    //     username: "username",
    //     credential: "password",
    //   },
    //   {
    //     urls: "turn:turn.gigaaa.com:3478?transport=tcp ",
    //     username: "username",
    //     credential: "password",
    //   },
    //   {
    //     urls: "turns:turn.gigaaa.com:3478?transport=tcp ",
    //     username: "username",
    //     credential: "password",
    //   },
   
]
  private destroyed$ = new Subject();

  isVideo:boolean|object=false;
  hasEchoCancellation=false;
  webrtcmediacontraints={
  audio:true,
  video:false
}
hasVideoparam={width:226,height:144};
 webrtcmediacontraints_user={
  offerToReceiveAudio:true,
  offerToReceiveVideo:true,
  iceRestart:true
}
  unsplitIcon='../../../../assets/assets_workdesk/split_icon14.svg';
  splitIcon='../../../../assets/assets_workdesk/smallscreen_icon14.svg'
  hasflipped:boolean=false;
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
  @ViewChild ('mobileremoveview') mobileremoveview:ElementRef;

numberOfbittobeColor:any;
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
 mediaDevices = navigator.mediaDevices as  any;
 mediadevice
 startstats:any;
 callQualityIndicator:any;
 ismousemove:boolean=true;
 inputMicrophone:Array<any>;
 outputSpeaker:Array<any>;
 videoInputDevice:Array<any>;
 inputDeviceid:any;
 outputDeviceid:any;
 showSwitcher:boolean=true;
 showtooltiptext:any;
 remotetrackEvent:MediaStream;
 lastuserdSpeaker:any;
 lasyuserspearkerID:any
 lastUsercameraId:any;
 cameraViewName:any="user";
 ismobile:boolean=false;
 remote:boolean;

     constructor(private changeDetector: ChangeDetectorRef,
     public dialogRef: MatDialogRef<CallInterfaceComponent>,
     private webrtcservice:webrtcsocket,
     @Inject(MAT_DIALOG_DATA) public data,
     private renderer: Renderer2,
        private message:MessageService) 
        { 
          let a=navigator.userAgent;
          this.ismobile= a.includes("Mobile");
          this.callQualityIndicator='../../../../assets/assets_workdesk/red.svg'
          this.detectDevices();
        let w = window.innerWidth;
     
          console.log("width",w);
          
          

        }
        // request video and audio 
        private async requestmediadevices(val:any): Promise<void>
        {
          const callstat=JSON.parse(localStorage.getItem("call_info"))


          try {
         
            this.localstream=await   this.mediaDevices.getUserMedia(val)
  
          
            this.localVideo.nativeElement.srcObject=this.localstream;
            this.localVideo1.nativeElement.srcObject=this.localstream;
            
            if(callstat?.is_refreshed==true){
           await  this.showListofDevices(0).finally(()=>{
              this.restoreLastUsedDevices(1);
             })
             }
             }
          catch (e) {
            }
            }

            ngOnDestroy(): void {
            this.destroyed$.next();
            this.destroyed$.complete();
            }

          ngOnInit(): void {
       
            this.addIncomingCallHandler();
            this.showUserInformation();
           
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

        @HostListener('document:mousemove', ['$event'],)
        onMouseDown(event) {
         
          let  timeout;
          this.renderer.listen(this.dragarea.nativeElement, 'mousemove', e => {
            if(this.peerscreenView==true&&this.ismobile==false)
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
            },3000);
          });
          
        }        
        mouseStopped()
        {
          if(this.peerscreenView==true && this.ismobile==false)
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
        touchstopped()
        {
          if(this.ismobile==true)
          { 
           this.renderer.setStyle(this.callcontrol.nativeElement, "bottom", "-100px");
            this.renderer.setStyle(this.callcontrol.nativeElement, "opacity", "0");
            this.renderer.setStyle(this.callcontrol.nativeElement, "animation", " fade 3s linear");
           // this.renderer.setStyle(this.callcontrol.nativeElement, "transition", "all 0.3s");
           this.renderer.setStyle(this.usercamera.nativeElement, "right", "-100px");
           this.renderer.setStyle(this.usercamera.nativeElement, "opacity", "0");
           this.renderer.setStyle(this.usercamera.nativeElement, "animation", " fade 3s linear");
          }
        }

        ontouchevetn() {
          this.dragarea.nativeElement.addEventListener( 'touchstart', e => {    
            if(this.ismobile==true)
            {    
              this.showControlOntouchevent()
            }
          });
        } 
        
        ontouchmove() {
          let  timeout;
          this.dragarea.nativeElement.addEventListener( 'touchend', e => {
            if(this.ismobile==true)
            {  
              clearTimeout(timeout);
              timeout= setTimeout(()=>{
                this.touchstopped();
              },3000);

          }
          });
          
        } 
        // @HostListener('body:click', ['$event'],)
        onclick() {
         
          let  timeout;
          var isloaded=1;
         this.dragarea.nativeElement.addEventListener( 'touchstart', e => {
            if(this.ismobile==true&&isloaded==1)
            {  
              clearTimeout(timeout);
              timeout= setTimeout(()=>{
                this.touchstopped();
                isloaded=0;
              },500);

          }
          });
          
        } 

        // show touch event on controls 
        showControlOntouchevent()
        {
            
             this.renderer.setStyle(this.callcontrol.nativeElement, "bottom", "0px");
              this.renderer.setStyle(this.callcontrol.nativeElement, "opacity", "1");
              this.renderer.setStyle(this.callcontrol.nativeElement, "animation", " fade 3s linear");

              this.renderer.setStyle(this.usercamera.nativeElement, "right", "0px");
              this.renderer.setStyle(this.usercamera.nativeElement, "opacity", "1");
              this.renderer.setStyle(this.usercamera.nativeElement, "animation", " fade 3s linear");
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
                await navigator.mediaDevices.getUserMedia({video:true}).then(vidstream=>{
                  vidstream.getVideoTracks()[0].stop()
                })
                await  this.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
                this.localstream=stream;
                const audiotrack=stream.getAudioTracks()[0];
                if(this.micbtn==true)
                {
                  audiotrack.enabled=false;
                }
                this.localVideo.nativeElement.srcObject = undefined;
                this.localVideo1.nativeElement.srcObject= undefined;
                this.localVideo1.nativeElement.srcObject=this.localstream;
                this.localVideo.nativeElement.srcObject=this.localstream;
               // this.localstream=stream;
                  this.peerconnection.addTrack(audiotrack,this.localstream);
              
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
                  this.webrtcservice.sendDataforCall({ type: "offer",peer_id:this.peerUserid,data:offer});
                 
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

    this.peerconnection= new RTCPeerConnection({
     
          iceServers:this.iceserversConfigs,
        iceTransportPolicy:'all',
        iceCandidatePoolSize:2,
        rtcpMuxPolicy:'require',
      } )
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
        await this.getcallTypeforPagereload();
        break;
        case "failed":
        case "disconnected":
        this.peerconnection.close()
        this.peerconnection=null;
        await this.createPeerConnection();
        await this.getcallTypeforPagereload();
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
        if(this.ismobile==false)
        {
        this.restoreLastUsedDevices(0);   
        }
        console.log("local tracks",this.peerconnection.getSenders())
        console.log("peer tracks",this.peerconnection.getReceivers())
      }
  
   
      ngAfterViewInit(): void {
        let callstat=  JSON.parse(localStorage.getItem("call_info"));
        if(callstat?.is_refreshed!=true)
        {
          this.createPeerConnection();
        }
        this.onclick();
        this.ontouchevetn();
        this.ontouchmove();
        this.requestmediadevices(this.webrtcmediacontraints);

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
          case "peer_id":
          this.userid=msg.id;
            if(callstat?.is_refreshed!=true)
            {
              localStorage.setItem("call_info",JSON.stringify({user_id:this.userid,is_refreshed:false}));
              this.saveuserFirstinformation();
            await   this.showListofDevices(1);
            }
            else{
              this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":callstat?.user_devices_info.data})
            }
          break;
          case "accept":
            this.peerUserid=msg.peer_id;
            if(callstat?.is_refreshed==true)
            {  
              console.log("accepet")
              this.getPeerDataInformation(callstat?.peer_devices_info);
             await this.createPeerConnection();
             await this.getcallTypeforPagereload();
             this.callstart=true;
             this.callstarttime=callstat?.last_duration;
             }
             else{
         
            this.callstart=true;
            this.callstarttime=new Date().getTime();
            callstat['last_duration']=this.callstarttime;
            callstat['is_refreshed']=true;
            localStorage.setItem("call_info",JSON.stringify(callstat));
            this.senduserInformation();
            await this.createOfferForPeer() 
          }
          break;
          case "peer_data":
          console.log(msg.data)
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
            
            await  this.peerconnection.setRemoteDescription(new RTCSessionDescription(msg)).then(async ()=>{
          
            }).then(async () => {
            // Build SDP for answer message
            return await this.peerconnection.createAnswer();
            }).then(async (answer) => {
            // Set local SDP
            console.log(answer)
            await this.peerconnection.setLocalDescription(answer);
           
            }).then(()=>{
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
            track.stop();
          })
          if(this.screensharebtn==false)
          {
            this.sharescreen.getTracks().forEach(track=>{
              track.stop();
            })
          }
        }
        hangupCall()
        { 
          this.webrtcservice.sendDataforCall({type:"hangup",data:""});
          this.peerconnection.close();
          this.peerconnection=null;
          this.closeVideoCall();
          this.closeStream();
         
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
                if(this.ismobile==false)
                {
                  this.dialogRef.addPanelClass('maximizeVideocallinterface'); 
                }
                else{
                  this.dialogRef.addPanelClass('minimizecallinterface'); 
                }
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
                  console.log("minimize")
                }
                if(this.peerscreenView==true)
                {
                  
                  this.dialogRef.removePanelClass('maximizeVideocallinterface');
                  this.dialogRef.addPanelClass('minimizecallinterface');
                  if(this.ismobile==false)
                  {
                    this.peercamera=false;
                  }
                 
                }
                 
                 
                
              }
            }
            if(this.splitscreen==true)
                {
                 
                  this.renderer.setStyle(this.localVideo1.nativeElement, "transform", "scaleX(-1)");
                }
                else{
                  this.renderer.setStyle(this.localVideo1.nativeElement, "transform", "scaleX(1)");
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
          if(this.peerscreenView==false && this.peercamera==true && this.ismobile==false)
          {
            this.dialogRef.addPanelClass('maximizeVideocallinterface');
            this.hidecamera=false;
          }
          else if(this.camerabtn==false && this.ismobile==false)
          {
            this.dialogRef.addPanelClass('maximizeVideocallinterface');
         
          
          }
          else 
          { this.dialogRef.addPanelClass('minimizecallinterface');
          this.touchstopped();
            this.hidecamera=true;
            if(this.ismobile==true)
            {
              this.showControlOntouchevent();
            }
          }
           this.unsplitIcon='../../../../assets/assets_workdesk/split_icon12.svg';
           this.splitIcon='../../../../assets/assets_workdesk/smallscreen_icon12.svg'
          
           this.hideScreen(this.peerscreenView);
           if(this.peerscreenView==true)
           {
             this.peercamera=false;
           }
          
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
          if(this.peerscreenView==true)
          {
            this.peercamera=true;
          }
       
        }
        
     
        }
   
      private async  startvideoCall() :Promise<void>
      {                 
        

         
          if(this.ismobile==true)
          {
            this.cameraViewName="user";
          }
            this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
            this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
        // this.webrtcmediacontraints.video=this.hasVideoparam; 
     
       await  navigator.mediaDevices.getUserMedia({video:this.hasVideoparam}).then((stream)=>{
            //this.localstream=stream;
            const videotrack=stream.getVideoTracks();
            const audiotrack=this.localstream.getAudioTracks();
            this.localstream.addTrack(videotrack[0]);
            this.localstream.addTrack(audiotrack[0]);
            
            this.localVideo.nativeElement.srcObject = undefined;
            this.localVideo1.nativeElement.srcObject= undefined;
            this.localVideo1.nativeElement.srcObject= stream
            this.localVideo.nativeElement.srcObject= stream;
           // const streamvid=new MediaStream([videotrack[0],audiotrack[0]])
            const audio=this.peerconnection.getSenders().find(data=>{
              return data.track?.kind=="audio";
            });
            if(audio==undefined)
            {
              this.peerconnection.addTrack(audiotrack[0]);
            }
            else{
              audio.replaceTrack(audiotrack[0])
            }
            const video=this.peerconnection.getSenders().find(data=>{
              return data.track?.kind=="video";
            });
            if(video==undefined)
            {
              this.peerconnection.addTrack(videotrack[0],this.localstream);
            }
            else{
                video.replaceTrack(videotrack[0])
            }
           
           
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
          this.webrtcservice.sendDataforCall({type: "offer",peer_id:this.peerUserid,data:offer  });

        })
       // this.hasflipped=false;
        
      }
      private async   pausevideoCall() :Promise<void>
      {  
           
           this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
            this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
         if(this.localstream.getVideoTracks()!=null)
         {
           this.localstream.getVideoTracks().forEach(data=>{
             data.stop();
           })
         }
      // this.webrtcmediacontraints.video=false; 
      await navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
      this.localstream=stream;
     // audiotrack=stream.getAudioTracks()[0];
  
     let audiotrack=this.localstream.getAudioTracks()[0];
     if(this.micbtn==true)
     {
       audiotrack.enabled=false;
     }
      this.localVideo.nativeElement.srcObject = undefined;
      this.localVideo1.nativeElement.srcObject= undefined;
      this.localVideo1.nativeElement.srcObject=this.localstream;
      this.localVideo.nativeElement.srcObject=this.localstream;
       //  this.localstream=new MediaStream([videotrack[0]])
       this.localstream.addTrack(audiotrack);
       const audio=this.peerconnection.getSenders().find(data =>{
        if(data.track!=null)
        {
          return data.track.kind=="audio";
        }
       })  
       if(audio==undefined)
       {
        this.peerconnection.addTrack(audiotrack,this.localstream); 
       }    
       else{
        audio.replaceTrack(audiotrack)

       }  
       // this.peerconnection.addTrack(videotrack[0],this.localstream);
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
       
        this.webrtcservice.sendDataforCall({ type:"offer" ,peer_id:this.peerUserid,data:offer});
       // this.getLastOfferforUser(offer);
          })
             }
             

             async createAudioOffer()
             {
                 this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
                  this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
                if(this.localstream)
                {
                  this.localstream.getVideoTracks().forEach(track=>{
                    track.enabled=false;
                    track.stop();
                  })
                }
            // this.webrtcmediacontraints.video=false; 
            await   this.mediaDevices.getUserMedia({audio:true,video:false}).then((stream)=>{
            //this.localstream=stream;
            let videotrack=stream.getAudioTracks();
            videotrack=stream.getAudioTracks();
            videotrack=this.localstream.getAudioTracks();
            this.localVideo.nativeElement.srcObject = undefined;
            this.localVideo1.nativeElement.srcObject= undefined;
            this.localVideo1.nativeElement.srcObject=this.localstream;
            this.localVideo.nativeElement.srcObject=this.localstream;
             this.localstream=new MediaStream([videotrack[0]])
          //  this.localstream.addTrack(videotrack[0]);
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
             
              this.webrtcservice.sendDataforCall({ type:"offer" ,peer_id:this.peerUserid,data:offer});
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
                this.getCameraViewofMobile(this.ismobile,this.remote,this.peercamera);

                }
                else if(val==false)
                { 
                this.splitscreen=true;
                if(this.peerscreenView==true)
                {
                  this.renderer.setStyle(this.remotevideo.nativeElement, "top", "50px");


                }
                this.getCameraViewofMobile(this.ismobile,this.remote,this.peercamera);

              
                }
                // if(this.camerabtn==false)
                // {
                //   this.renderer.setStyle(this.localVideo1.nativeElement, "transform", "scaleX(-1)");
                // }
                // else{
                //   this.renderer.setStyle(this.localVideo1.nativeElement, "transform", "scaleX(1)");

                // }
           
                }


      startAudio()
      { 
        this.localstream.getAudioTracks().forEach(track=>{
          track.enabled=true;
        })
      // if(this.sharescreen!=undefined)
      // {
      //   this.sharescreen.getAudioTracks()[0].enabled=true;
      // }
      }
      
      pauseAudio()
      {
        this.localstream.getAudioTracks().forEach(track=>{
          track.enabled=false;
        })
        // if(this.sharescreen!=undefined)
        // {
        //   this.sharescreen.getAudioTracks()[0].enabled=false;
        // }
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
        this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
        }
        saveuserFirstinformation()
        {
          const user = JSON.parse(localStorage.getItem('gigaaa-user'));
        this.userFirstName=user.profile.first_name;
        this.userLastName=user.profile.last_name;
        this.userPicture=user.avatar_url;
        this.userPicture=user.avatar_url;
        console.log(this.userFirstName,this.userLastName);
        this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
        }

       // get peer data information
       getPeerDataInformation(data:any)
       {
        this.peerdeviceinfo(data);
        this.peerFirstname=data.first_name;
        this.peerLastname=data.last_name;
        this.peerPicture=data.img_url;
        this.peercamera=data.is_camera_on;
      
        // if(data.is_shared_screen==true)
        // { 
        //   this.peercamera=data.is_shared_screen;
        // }
        this.remote=data.is_mobile;
        this.getCameraViewofMobile(this.ismobile,data.is_mobile,data.is_camera_on);
        this.peerscreenView=data.is_shared_screen;
        this.peerFirstnameinitials= this.peerFirstname.toUpperCase().charAt(0);
        this.peerLastnameinitials= this.peerLastname.toUpperCase().charAt(0);
        if(this.peerscreenView==true)
        {
          this.hideScreen(this.peerscreenView);
          this.peercamera=this.peerscreenView;
          if(this.ismobile==true)
          {
            this.sharescreenviewformobile(this.peerscreenView,this.splitscreen);
          }
          else{
            this.renderer.setStyle(this.remotevideo.nativeElement, "object-fit", "revert");
          }
        }
        else 
        {
          this.renderer.setStyle(this.remotevideo.nativeElement, "object-fit", "cover");
          
        }
        if(this.hideContant==false)
        { this.hideContant=false;
          this.is_dragable=false;
        this.hideScreen(this.peerscreenView);
        }

        
        if(this.peerscreenView!=false && this.ismobile==false)
        {
          this.renderer.setStyle(this.usercamera.nativeElement, "display", "none");
          this.renderer.setStyle(this.callcontrol.nativeElement, "display", "none");
        }
        else {
        this.renderer.setStyle(this.usercamera.nativeElement, "z-index", "2");
        this.renderer.setStyle(this.usercamera.nativeElement, "display", "flex");
        this.renderer.setStyle(this.usercamera.nativeElement, "transform", "unset");
        this.renderer.setStyle(this.usercamera.nativeElement, "transform", "unset");
        this.renderer.setStyle(this.usercamera.nativeElement, "transition", "0.3s");
        /////////////////////////////////////////////////////////
       this.renderer.setStyle(this.callcontrol.nativeElement, "z-index", "2");
        this.renderer.setStyle(this.callcontrol.nativeElement, "display", "inline-block");
        this.renderer.setStyle(this.callcontrol.nativeElement, "transform", "unset");
        this.renderer.setStyle(this.callcontrol.nativeElement, "transform", "unset");
        this.renderer.setStyle(this.callcontrol.nativeElement, "transition", "0.3s");
        }
       }

       // mobile view of camera 
       getCameraViewofMobile(localdevice,remotedevice,cameraonoff)
       {
         if(localdevice==false && remotedevice==true && cameraonoff==true && this.splitscreen==false)
         {
          this.renderer.setStyle(this.remotevideo.nativeElement, "width", "30%");
          this.renderer.setStyle(this.remotevideo.nativeElement, "left", "35%");
          this.renderer.setStyle(this.remotevideo.nativeElement, "right", "35%");
         }
         else if(localdevice==false && remotedevice==true && cameraonoff==true && this.splitscreen==true){
          this.renderer.setStyle(this.remotevideo.nativeElement, "width", "50%");
          this.renderer.setStyle(this.remotevideo.nativeElement, "left", "unset");
          this.renderer.setStyle(this.remotevideo.nativeElement, "right", "0%");
         }
       }
       // screen share to other peer

        private async screenShare(val):Promise<void>
        {
         
          if(val==true)
              {   
                if(this.localstream.getVideoTracks()[0]!=undefined)
                {
                  this.localstream.getVideoTracks()[0].stop();
                }
                this.mediaDevices.getDisplayMedia({audio:false,video:true}).then(stream=>{
                this.screensharebtn=false;
                this.sharescreen=stream;
               // this.sharescreen.removeAl
                this.stopStreamByBrowser(stream)
                if(this.camerabtn==false)
                {
                  this.pausevideoCall();
                  this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":true, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
                }
     
                  this.toggleViewForSharescree(true);
                  const localAudio= this.localstream.getAudioTracks()[0];
                  const videotrack= stream.getVideoTracks()[0];
                  this.sharescreen.addTrack(localAudio)
               
                  if(this.micbtn==true)
                  {
                    localAudio.enabled=false;
                  }
                  this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":true, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
                  this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":true, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
                  this.renderer.setStyle(this.localVideo1.nativeElement, "transform", "scaleX(1)");
           
                  this.localVideo1.nativeElement.srcObject=undefined;
                  this.localVideo.nativeElement.srcObject=undefined;
                  this.localVideo1.nativeElement.srcObject= stream;
                  this.localVideo.nativeElement.srcObject= stream;
                  this.localstream.addTrack(videotrack);
                 // this.sharescreen=stream
                  const audio=this.peerconnection.getSenders().find(data=>{
                    if(data.track!=null)
                    {
                      return data.track?.kind==="audio";
                    }
                  })
                // this.peerconnection.addTrack(localAudio,this.localstream);
                  const video=this.peerconnection.getSenders().find(data=>{
                    if(data!=null)
                    {
                      return data.track?.kind==="video";
                    }
                  })
                  if(video==undefined)
                  {
                    this.peerconnection.addTrack(videotrack,this.localstream)
                  }
                  else{
                    video.replaceTrack(videotrack)
                  }

                  console.log(audio)
                 audio.replaceTrack(localAudio);
                 if(audio==undefined)
                 {
                  console.log("one")
                  this.peerconnection.addTrack(localAudio,this.localstream)
                 }
                 else{
                   console.log("two",audio)
                   console.log("localpeers",this.peerconnection.getSenders())
                   audio.replaceTrack(localAudio);
                   
                 }
                 
                  }).then(async ()=>{
                  const offer:RTCSessionDescriptionInit=await this.peerconnection.createOffer({
                  offerToReceiveAudio:true,
                  offerToReceiveVideo:true,
                  iceRestart:true
                  });
                  await this.peerconnection.setLocalDescription(offer);
                  this.webrtcservice.sendDataforCall({type: "offer" ,peer_id:this.peerUserid,data:offer });
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
                  this.renderer.setStyle(this.localVideo1.nativeElement, "transform", "scaleX(-1)");
                  this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
                  this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
                }
                else if(this.camerabtn==true)
                {
                  //this.pausevideoCall();
                  this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
                  this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
                }
               }
             
            }
              // end share screen stream
            stopStreamByBrowser(stream:MediaStream)
            {
          
              stream.getTracks()[0].addEventListener('ended',()=>{
                console.log("ended")

                this.toggleViewForSharescree(false);
                  this.screensharebtn=true;
                  if(this.camerabtn==true)
                  {
                    this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
                    this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
    
                  }
                  else if(this.camerabtn==false)
                  {
                    this.startvideoCall();
                    this.renderer.setStyle(this.localVideo1.nativeElement, "transform", "scaleX(-1)");
    
                    this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
                    this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
    
                  }
                })
           
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
          const callstat=JSON.parse(localStorage.getItem("call_info"));
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
    
 
          // refres state of calls
          private async getcallTypeforPagereload():Promise<void>
          {
              let callstat=JSON.parse(localStorage.getItem("call_info"));
              if(callstat.user_devices_info?.data.is_camera_on==true&&callstat.user_devices_info?.data.is_shared_screen==false)
              {

                  // this.camerabtncheck(true);
                   this.camerabtn=false;
               this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
               this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": true, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
                 await  this.mediaDevices.getUserMedia({audio:true,video:true}).then((stream)=>{
                  this.localstream=stream;
                  const audiotrack=stream.getAudioTracks()[0];
                  const videotrack=stream.getVideoTracks()[0];
                  this.localstream.addTrack(videotrack);
                  this.localstream.addTrack(audiotrack)
                  if(this.micbtn==true)
                  {
                    audiotrack.enabled=false;
                  }
                  this.localVideo.nativeElement.srcObject = undefined;
                  this.localVideo1.nativeElement.srcObject= undefined;
                  this.localVideo1.nativeElement.srcObject=this.localstream;
                  this.localVideo.nativeElement.srcObject=this.localstream;
                  this.localstream=stream;
                  const audio=this.peerconnection.getSenders().find(data=>{
                    if(data.track!=null)
                    {
                      return data.track.kind=="audio"
                    }
                  })
                  if(audio==undefined)
                  {
                    this.peerconnection.addTrack(audiotrack,this.localstream);

                  }
                  else{
                    
                    audio.replaceTrack(audiotrack);
                  }
                  const video =this.peerconnection.getSenders().find(data=>{
                    if(data.track!=null)
                    {
                      return data.track.kind=="video";
                    }
                  })
                  if(audio==undefined)
                  {
                    this.peerconnection.addTrack(videotrack,this.localstream);

                  }
                  else{
                    
                    video.replaceTrack(videotrack);
                  }
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
                    this.webrtcservice.sendDataforCall({ type: "offer",peer_id:this.peerUserid,data:offer});
                   
                    })
              }
              else if(callstat.user_devices_info?.data.is_camera_on==true&&callstat.user_devices_info?.data.is_shared_screen==true)
              {
              if(this.sharescreen)
              {
              this.sharescreen.getTracks().forEach(track=>{
                this.peerconnection.addTrack(track, this.sharescreen);
              });
              const offer:RTCSessionDescriptionInit=await this.peerconnection.createOffer({
              offerToReceiveAudio:true,
              offerToReceiveVideo:true,
              iceRestart:true
              });
              await this.peerconnection.setLocalDescription(offer);
              this.webrtcservice.sendDataforCall({type:"offer",peer_id:this.peerUserid,data:offer });
            }
            else{
              this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
            this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
            await  this.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
              this.localstream=stream;
              const audiotrack=stream.getAudioTracks()[0];
              this.localstream.addTrack(audiotrack)
              if(this.micbtn==true)
              {
                audiotrack.enabled=false;
              }
           
              this.localVideo.nativeElement.srcObject = undefined;
              this.localVideo1.nativeElement.srcObject= undefined;
              this.localVideo1.nativeElement.srcObject=this.localstream;
              this.localVideo.nativeElement.srcObject=this.localstream;
              this.localstream=stream;
              const audio=this.peerconnection.getSenders().find(data=>{
                if(data.track!=null)
                {
                  return data.track.kind=="audio"
                }
              })
              if(audio==undefined)
              {
                this.peerconnection.addTrack(audiotrack,this.localstream);

              }
              else{
                audio.replaceTrack(audiotrack);

              }
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
                this.webrtcservice.sendDataforCall({ type: "offer",peer_id:this.peerUserid,data:offer});
               
                })
            }
        
           }
           else if(callstat.user_devices_info?.data.is_camera_on==false&&callstat.user_devices_info?.data.is_shared_screen==false)
           {
           // this.camerabtncheck(false)
           this.webrtcservice.sendDataforCall({"type": "update_peer", "user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
           this.setUserInfo({"type": "update_peer","user_id":this.userid,"data":{"is_camera_on": false, "is_microphone_on":true, "is_shared_screen":false, "first_name":  this.userFirstName,"last_name":  this.userLastName, "img_url":this.userPicture,"is_mobile":this.ismobile}})
             await  this.mediaDevices.getUserMedia({audio:true,}).then((stream)=>{
              const audiotrack=stream.getAudioTracks()[0];
              this.localstream.addTrack(audiotrack);
              if(this.micbtn==true)
              {
                audiotrack.enabled=false;
              }
            
              this.localVideo.nativeElement.srcObject = undefined;
              this.localVideo1.nativeElement.srcObject= undefined;
              this.localVideo1.nativeElement.srcObject=this.localstream;
              this.localVideo.nativeElement.srcObject=this.localstream;
              this.localstream=stream;
           
              const audio=this.peerconnection.getSenders().find(data=>{
                if(data.track!=null)
                {
                  return data.track.kind=="audio"
                }
              })
              if(audio==undefined)
              {
                this.peerconnection.addTrack(audiotrack,this.localstream);
              }
              else{
                
                audio.replaceTrack(audiotrack);
              }
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
                this.webrtcservice.sendDataforCall({ type: "offer",peer_id:this.peerUserid,data:offer});
               
                })
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
         //   await  navigator.mediaDevices.enumerateDevices();
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
              
            // if (this.localstream) {
            //  this.localstream.getAudioTracks().forEach(track => {
            //    track.stop()
            //  });
            // }
            
            await this.mediaDevices.getUserMedia(constraint).then(async stream=>{
             this.showMicroPhoneLevels(micename, stream);
           navigator.mediaDevices.ondevicechange=null
           let audiotrk=stream.getAudioTracks()[0];
          // audiotrk=this.localstream.getAudioTracks()[0];
          // this.localstream.addTrack(audiotrk)
           this.localstream=stream;
              if(this.peerconnection)
              {
           let audioupdt=this.peerconnection.getSenders().find(trk=>{
             return trk.track.kind==="audio";
            })
            if(this.micbtn==true)
            {
              stream.getAudioTracks()[0].enabled=false;
            }
            console.log(audioupdt)
            if(audioupdt!=undefined)
            {
              
              audioupdt.replaceTrack(audiotrk);
              this.localstream.addTrack(audiotrk)
            }
          }
           }).catch(err=>{
             console.log(err)
           })
          }
          // select speaker options 
        private async   selectSpeaker(Val):Promise<void>
          { 
            
            
            if(this.remotetrackEvent)
            {
              this.getLastUsedSpeaker(Val);
              let updateddata=this.setDefaultDevice(this.outputSpeaker,Val.data.label);
             this.remotevideo.nativeElement.volume=0;
              if(this.remotevideo.nativeElement.children.length>0)
              {
                console.log("volume down")
                this.remotevideo.nativeElement.removeChild(this.remotevideo.nativeElement.children[0])
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
              //this.remotevideo.nativeElement.replaceWith(test_output_audio1);
            
              this.remotevideo.nativeElement.appendChild(test_output_audio1);
              console.log("child nodes",this.remotevideo.nativeElement.children.length)
              
               this.lastuserdSpeaker=test_output_audio1;
         
              this.outputSpeaker=updateddata;

            }
            await  navigator.mediaDevices.enumerateDevices();
         
          }
         
 
          setDefaultDevice(devices:Array<any>,selecteddeviceid:any)
          { 
            console.log("before",devices)
            let devicesData=[];
             devices.forEach(element => {
              if(element.data.label==selecteddeviceid)
              {
                element.selected=true;
                devicesData.push(element);
              }
              else{
                element.selected=false
                devicesData.push(element);
              }
            });
            console.log("after",devicesData)
            return devicesData;
          }
          // show the list of devices input output 
       private async showListofDevices(isload:any)
          {

            let inputDevice=[];
            let outputDevice=[];
            let videoInputDevice=[];
            let alldevices=[];
         await   navigator.mediaDevices.enumerateDevices().then( devices=>{
              alldevices=devices;
              devices.forEach(async device=>{
              if(device.kind== "audioinput")
              {
                  inputDevice.push({data:device,selected:false});
              }
              else if(device.kind=="audiooutput")
              {
                if(device.deviceId=="default")
                {
                 outputDevice.push({data:device,selected:true});
                // await  this.selectSpeaker({data:device,selected:true},1);
                this.lasyuserspearkerID={data:device,selected:true}
                let callstat=JSON.parse(localStorage.getItem("call_info"));
                  if(callstat?.is_refreshed==false)
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
            this.inputMicrophone=inputDevice;
            this.outputSpeaker=outputDevice;
            }).finally( ()=>{
              let micdata= inputDevice.find(data => {
                return data.data.kind == "audioinput";
              })
              console.log(micdata)
              this.selectMicrophone(micdata,isload)
            })
             
           
          
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
              //const allPids =Array.from(document.querySelectorAll(".voicebars"+mic_name) as unknown as Array<HTMLElement>)
              this.numberOfbittobeColor = Math.round(avgsound / 2);
                // const pidsToColor = allPids.slice(0, numberOfPidsToColor);
                // for (const pid of allPids) {
                //     pid.style.backgroundColor = "#3A4559";
                // }
                // for (const pid of pidsToColor) {
                //   pid.style.backgroundColor = "#76CB09";
                // }
            
                // this.inputDeviceid=mic_name
           
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

            // flip camera for mobile
            async flipCamera(val)
            {
              this.hasflipped=true;
             let cameraName;
             let cameraList=[];
             console.log("first",this.peerconnection.getSenders())

              if( this.camerabtn==false)
              {  
                if(this.localstream.getVideoTracks()!=null)
                {
                  this.localstream.getVideoTracks().forEach(data=>{
                    data.stop();
                  })
                }
              
                let audioupdt=this.peerconnection.getSenders().find(trk=>{
                       
                if(trk.track!=null)
                {
                 return trk.track.kind=="video";
                }
               })
               cameraName=audioupdt.track.label;
               console.log("camera_name",cameraName)
              await  navigator.mediaDevices.enumerateDevices().then(devices=>{
                devices.find(device=>{
                  if(device.kind=="videoinput")
                  {
                    cameraList.push(device)
                  }
                })
              }).then(()=>{
                if (this.localstream) {
              
                    cameraList.forEach(cam=>{
                      if(cam.label!=cameraName)
                      {
                        this.lastUsercameraId=cam.deviceId;
                        let  constraint={video:{deviceId: this.lastUsercameraId}};
             
                        this.mediaDevices.getUserMedia(constraint).then( stream=>{
                        // this.localstream=stream;
                        stream.getVideoTracks()[0].enabled=true;
                        this.localVideo.nativeElement.srcObject=undefined;
                        this.localVideo1.nativeElement.srcObject=undefined;
                        this.localVideo.nativeElement.srcObject=stream;
                        this.localVideo1.nativeElement.srcObject=stream;
                       let videotrk=  stream.getVideoTracks()[0];
                        this.localstream.addTrack(videotrk);
                      // this.localstream=new MediaStream([videotrk])

                      
                       // this.peerconnection.removeTrack(audioupdt)
                       

                       audioupdt.replaceTrack(videotrk)
                        if(val=="user")
                        {
                          this.cameraViewName="environment"
                          this.renderer.setStyle(this.localVideo.nativeElement,"transform","scaleX(1)")
                          this.renderer.setStyle(this.localVideo1.nativeElement,"transform","scaleX(1)")
                        }
                        else if(val=="environment")
                        {
                          this.cameraViewName="user"
                          this.renderer.setStyle(this.localVideo.nativeElement,"transform","scaleX(-1)")
                          this.renderer.setStyle(this.localVideo1.nativeElement,"transform","scaleX(-1)")
                        }
                        const callstat=JSON.parse(localStorage.getItem("call_info"))
                        //  this.selectMicrophone(callstat?.user_last_mic,1)
                    
                       }).catch(err=>{
                         console.log(err)
                       })
                      }
                    })
                 
                 }
              })
               
              

             
            // this.getcallTypeforPagereload();
            
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

            // mobile filter 
            sharescreenviewformobile(sharescreen,issplit)
            {
              if(sharescreen==true && issplit==true)
              {
                this.renderer.setStyle(this.remotevideo.nativeElement, "object-fit", "contain");
              }
              else if(sharescreen==true && issplit==false)
              {
                this.renderer.setStyle(this.remotevideo.nativeElement, "object-fit", "revert");
              }

            }
         
}