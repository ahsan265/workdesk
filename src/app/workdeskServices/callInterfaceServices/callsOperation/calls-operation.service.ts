import { Injectable } from '@angular/core';
import { CallSocketService } from 'src/app/workdeskSockets/callSocket/call-socket.service';
import { MessageService } from '../../messageService/message.service';
import { PeerConnectionService } from '../peerConnection/peer-connection.service';
import { StreamingService } from '../stream/streaming.service';
import { AgentUserInformation } from 'src/app/workdeskServices/callInterfaceServices/agentUserInformation/agent-user-information.service';
import { AuthService } from 'src/app/services/auth.service';
import { devcieInformationModel, PeersCallsInformationModel } from 'src/app/models/callInterfaceModel';
import { Subject } from 'rxjs';
import { DevicesInformationService } from '../devicesInformation/devices-information.service';
import { CommonService } from '../../commonEndpoint/common.service';

@Injectable({
  providedIn: 'platform'
})
export class CallsOperationService {
  peerUserId!: string;
  userId!: string;
  sendPeerInformation = new Subject<PeersCallsInformationModel>();
  startTimer = new Subject<boolean>();

  constructor(
    private CallSocketService: CallSocketService,
    private PeerConnectionService: PeerConnectionService,
    private StreamingService: StreamingService,
    private MessageService: MessageService,
    private AgentUserInformation: AgentUserInformation,
    private CommonService: CommonService,
    private AuthService: AuthService
  ) { }

  // add incoming call handler
  addIncomingCallHandler() {
    const callsData = this.AgentUserInformation.getCallInformation();
    this.CallSocketService.sendDataToInterface.subscribe(
      async (msg: any) => {
        switch (msg.type) {
          case 'offer':
            if (msg.data !== undefined) {
              await this.PeerConnectionService.handlOfferMessage(msg.data);
            }
            break;
          case 'answer':
            if (msg.data !== null) {
              this.PeerConnectionService.handleAnswerMessage(msg.data);
            }
            break;
          case 'hangup':
            this.hanndleHangupMessage(msg.data);
            break;
          case 'ice-candidate':
            this.PeerConnectionService.handleIceCandidateMessage(msg.data);
            break;
          case 'peer_id':
            if (callsData.is_refreshed !== true) {
              this.userId = msg.id;
              this.AgentUserInformation.setRefreshStatus(false);
              this.AgentUserInformation.saveUserInformation(
                this.userId,
                false,
                true,
                false,
                this.AuthService.getLoggedUser(),
              );
                await this.StreamingService.selectedDeviceForStream(false);
            
              this.startTimer.next(false);

            }
            break;
          case 'accept':
            this.peerUserId = msg.peer_id;
            if (callsData.is_refreshed !== true) {
              const timer = new Date(Date.now());
              this.AgentUserInformation.setLastCallDuration(timer);
              this.AgentUserInformation.setRefreshStatus(true);
              callsData.call_type === 'Video' ? (this.AgentUserInformation.updateCameraStatus(true), this.StreamingService.setCallType.next(true), this.StreamingService.startVideo(this.peerUserId)) :
                this.StreamingService.sendFirstOffer(this.peerUserId);
              this.startTimer.next(true);
            } else {
              this.sendPeerInformation.next(callsData.peer_information.data);
              this.startTimer.next(true);
              setTimeout(async () => {

                // this.PeerConnectionService.peerConnection.close();
                // await this.PeerConnectionService.createPeerConnection();
                this.StreamingService.reloadOfferSend(this.peerUserId);
              }, 1000);
            }
            break;
          case 'peer_data':
            const peerData: PeersCallsInformationModel = {
              deviceType: msg.data.is_mobile,
              display_name: msg.data.display_name,
              firstName: msg.data.first_name,
              lastName: msg.data.last_name,
              isCameraOn: msg.data.is_camera_on,
              isMicrophoneOn: msg.data.is_microphone_on,
              isScreenShareOn: msg.data.is_shared_screen,
              peerId: msg.peer_id,
              peerImage: msg.data.img_url
            };
            this.AgentUserInformation.savePeerInformation(peerData);
            this.sendPeerInformation.next(peerData);
            break;
          case 'peer_notification':
            this.MessageService.setInformationMessage(msg.data.msg);
            break;
          default:
        }
      },
      (error: any) => { }
    );
  }

  // hang up call
  private hanndleHangupMessage(msg: any) {
    this.StreamingService.hangUpCall();
  }
}
