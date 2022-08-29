import { Injectable } from '@angular/core';
import { CallSocketService } from 'src/app/workdeskSockets/callSocket/call-socket.service';
import { MessageService } from '../../messageService/message.service';
import { PeerConnectionService } from '../peerConnection/peer-connection.service';
import { StreamingService } from '../stream/streaming.service';
import { AgentUserInformation } from 'src/app/workdeskServices/callInterfaceServices/agentUserInformation/agent-user-information.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CallsOperationService {
  peerUserId!: string;
  userId!: string;
  constructor(
    private CallSocketService: CallSocketService,
    private PeerConnectionService: PeerConnectionService,
    private StreamingService: StreamingService,
    private MessageService: MessageService,
    private AgentUserInformation: AgentUserInformation,
    private AuthService: AuthService
  ) { }

  // add incoming call handler
  addIncomingCallHandler() {
    // const callsData = this.AgentUserInformation.getCallInformation();
    this.CallSocketService.sendDataToInterface.subscribe(
      async (msg: any) => {
        switch (msg.type) {
          case 'offer':
            await this.handlOfferMessage(msg.data);
            break;
          case 'answer':
            this.handleAnswerMessage(msg.data);
            break;
          case 'hangup':
            this.hanndleHangupMessage(msg.data);
            break;
          case 'ice-candidate':
            this.handleIceCandidateMessage(msg.data);
            break;
          case 'peer_id':
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
            this.AgentUserInformation.callJoiningTime(timer);
            break;
          case 'accept':
            this.peerUserId = msg.peer_id;
            setTimeout(() => {
              this.StreamingService.sendFirstOffer(this.peerUserId, this.userId);
            }, 500);
            console.log(this.PeerConnectionService.peerConnection.getReceivers());
            const startTime = new Date(Date.now());
            this.AgentUserInformation.setRefreshStatus(true);
            this.AgentUserInformation.setLastCallDuration(startTime)
            this.AgentUserInformation.callJoiningTime(startTime);
            break;
          case 'peer_data':
            console.log(msg.data)
            break;
          case 'peer_notification':
            this.MessageService.setInformationMessage(msg.data.msg);
            break;
          default:
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  // handle Offer messager After recieving offer from peer candidate.
  private async handlOfferMessage(
    msg: RTCSessionDescriptionInit
  ): Promise<void> {
    await this.PeerConnectionService.peerConnection
      .setRemoteDescription(new RTCSessionDescription(msg))
      .then(async () => {
        return await this.PeerConnectionService.peerConnection.createAnswer();
      })
      .then(async (answer) => {
        await this.PeerConnectionService.peerConnection.setLocalDescription(
          answer
        );
      })
      .then(() => {
        this.CallSocketService.sendDataforCall({
          type: 'answer',
          data: this.PeerConnectionService.peerConnection.localDescription
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  // handle answer message
  private async handleAnswerMessage(
    data: RTCSessionDescriptionInit
  ): Promise<void> {
    await this.PeerConnectionService.peerConnection
      .setRemoteDescription(new RTCSessionDescription(data))
      .catch(async (error: any) => {
        console.log(error);
      });
  }

  // hang up call
  private hanndleHangupMessage(msg: any) {
    this.StreamingService.hangUpCall();
  }

  // handle ice Condate Messages
  private async handleIceCandidateMessage(
    data: RTCIceCandidate
  ): Promise<void> {
    if (data.candidate != undefined) {
      await this.PeerConnectionService.peerConnection
        .addIceCandidate(data)
        .catch((error: any) => {
          console.log(error);
        });
    }
  }
  // send first offer

  private async createOfferForPeer(): Promise<void> {
    await this.PeerConnectionService.createPeerConnection();
    const streamData = this.StreamingService.localStream;
    const audioTrack = streamData.getAudioTracks()[0];
    streamData.addTrack(audioTrack);
    this.PeerConnectionService.peerConnection.addTrack(audioTrack, streamData);
    const offer: RTCSessionDescriptionInit =
      await this.PeerConnectionService.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceRestart: true
      });
    await this.PeerConnectionService.peerConnection
      .setLocalDescription(offer)
      .catch((error: any) => {
        console.log(error);
      });
    this.CallSocketService.sendDataforCall({
      type: 'offer',
      peer_id: this.peerUserId,
      data: offer
    });
  }
}
