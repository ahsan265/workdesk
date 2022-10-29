import { Injectable } from '@angular/core';
import { CallSocketService } from 'src/app/workdeskSockets/callSocket/call-socket.service';
import { MessageService } from '../../messageService/message.service';
import { PeerConnectionService } from '../peerConnection/peer-connection.service';
import { StreamingService } from '../stream/streaming.service';
import { AgentUserInformation } from 'src/app/workdeskServices/callInterfaceServices/agentUserInformation/agent-user-information.service';
import { AuthService } from 'src/app/services/auth.service';
import { PeersCallsInformationModel } from 'src/app/models/callInterfaceModel';
import { Subject } from 'rxjs';
import { CloseDialogOverlayRef } from 'src/app/callInterface/overLayService/closeDialogService';

@Injectable({
  providedIn: 'root'
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
    private AuthService: AuthService
  ) {}

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
            this.PeerConnectionService.handleAnswerMessage(msg.data);
            break;
          case 'hangup':
            this.hanndleHangupMessage(msg.data);
            break;
          case 'ice-candidate':
            this.PeerConnectionService.handleIceCandidateMessage(msg.data);
            break;
          case 'peer_id':
            if (callsData.is_refreshed != true) {
              this.userId = msg.id;
              this.AgentUserInformation.setRefreshStatus(false);
              this.AgentUserInformation.saveUserInformation(
                this.userId,
                false,
                true,
                false,
                this.AuthService.user.value
              );
              const timer = new Date(Date.now());
              this.startTimer.next(true);
              this.AgentUserInformation.setLastCallDuration(timer);
            }
            break;
          case 'accept':
            this.peerUserId = msg.peer_id;
            if (callsData.is_refreshed != true) {
              setTimeout(() => {
                this.StreamingService.sendFirstOffer(this.peerUserId);
              }, 500);

              this.AgentUserInformation.setRefreshStatus(true);
            } else {
              this.sendPeerInformation.next(callsData.peer_information.data);
              //  this.PeerConnectionService.peerConnection.close();
              // await this.PeerConnectionService.createPeerConnection();
              // }
              setTimeout(() => {
                this.StreamingService.reloadOfferSend(this.peerUserId);
              }, 500);
              // this.StreamingService.restoreLastUsedMicrophone();
              this.startTimer.next(true);
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
      (error: any) => {
      }
    );
  }

  // hang up call
  private hanndleHangupMessage(msg: any) {
    this.StreamingService.hangUpCall();
  }
}
