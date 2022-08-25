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
  constructor(private CallSocketService: CallSocketService,
    private PeerConnectionService: PeerConnectionService,
    private StreamingService: StreamingService,
    private MessageService: MessageService,
    private AgentUserInformation: AgentUserInformation,
    private AuthService: AuthService
  ) {
  }


  // add incoming call handler
  addIncomingCallHandler() {
    const callsData = this.AgentUserInformation.getCallInformation();
    this.CallSocketService.sendDataToInterface.subscribe(async (msg: any) => {
      console.log(msg)
      switch (msg.type) {
        case "offer":
          await this.handlOfferMessage(msg.data);
          break;
        case "answer":
          this.handleAnswerMessage(msg.data);
          break;
        case "hangup":
          this.hanndleHangupMessage(msg.data);
          break;
        case "ice-candidate":
          this.handleIceCandidateMessage(msg.data);
          break;
        case "peer_id":
          this.userId = msg.id;
          this.AgentUserInformation.setRefreshStatus(this.userId, false);
          this.AgentUserInformation.saveUserInformation(this.userId, false, true, false, this.AuthService.user.value)
          //  this.CallSocketService.sendDataforCall({ "type": "update_peer", "user_id": msg.id, "data": callsData['user-information'] })
          break;
        case "accept":
          this.peerUserId = msg.peer_id;
          this.createOfferForPeer();
          break;
        case "peer_data":
          break;
        case "peer_notification":
          this.MessageService.setInformationMessage(msg.data.msg);
          break;
        default:
      }
    }, (error: any) => {
      console.log(error)
    })
  }

  // handle Offer messager After recieving offer from peer candidate.
  private async handlOfferMessage(msg: RTCSessionDescriptionInit): Promise<void> {
    await this.PeerConnectionService.peerConnection.setRemoteDescription(new RTCSessionDescription(msg)).then(async () => {
    }).then(async () => {
      // Build SDP for answer message
      return await this.PeerConnectionService.peerConnection.createAnswer();
    }).then(async (answer) => {
      // Set local SDP
      console.log(answer)
      await this.PeerConnectionService.peerConnection.setLocalDescription(answer);
    }).then(() => {
      this.CallSocketService.sendDataforCall({ type: "answer", data: this.PeerConnectionService.peerConnection.localDescription });
    }).catch((error: any) => {
      console.log(error)
    });

  }

  // handle answer message 
  private async handleAnswerMessage(data: RTCSessionDescriptionInit): Promise<void> {
    await this.PeerConnectionService.peerConnection.setRemoteDescription(new RTCSessionDescription(data)).catch(async (error: any) => {
      console.log(error)
    })
  }

  // hang up call
  private hanndleHangupMessage(msg: any) {
    this.StreamingService.closeStream();
  }

  // handle ice Condate Messages 
  private async handleIceCandidateMessage(data: RTCIceCandidate): Promise<void> {
    if (data.candidate != "") {
      await this.PeerConnectionService.peerConnection.addIceCandidate(data).catch((error: any) => {
        console.log(error)
      });
    }
  }
  // send first offer 

  private async createOfferForPeer(): Promise<void> {
    await this.PeerConnectionService.createPeerConnection()
    const streamData = this.StreamingService.localStream;
    const audioTrack = streamData.getAudioTracks()[0];
    streamData.addTrack(audioTrack);
    this.PeerConnectionService.peerConnection.addTrack(audioTrack, streamData);
    const offer: RTCSessionDescriptionInit = await this.PeerConnectionService.peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
      iceRestart: true
    })
    await this.PeerConnectionService.peerConnection.setLocalDescription(offer).catch((err: any) => {
      console.log(err)
    });
    this.CallSocketService.sendDataforCall({ type: "offer", peer_id: this.peerUserId, data: offer });
  }
}
