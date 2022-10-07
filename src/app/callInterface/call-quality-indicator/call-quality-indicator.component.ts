import { Component, Input, OnInit } from '@angular/core';
import { PeerConnectionService } from 'src/app/workdeskServices/callInterfaceServices/peerConnection/peer-connection.service';
import { StreamingService } from 'src/app/workdeskServices/callInterfaceServices/stream/streaming.service';

@Component({
  selector: 'app-call-quality-indicator',
  templateUrl: './call-quality-indicator.component.html',
  styleUrls: ['./call-quality-indicator.component.scss']
})
export class CallQualityIndicatorComponent implements OnInit {
  @Input() callQualityValue: number = 0;
  selectIconForIndicator: string =
    '../../../assets/images/callInterface/red.svg';

  constructor(private PeerConnectionService: PeerConnectionService,
  ) {
  }
  indicatorfunction() {
    if (this.PeerConnectionService.remoteStream != undefined) {
      const track = this.PeerConnectionService.remoteStream.getAudioTracks()[0]
      if (this.PeerConnectionService.peerConnection.getSenders().length != 0) {
        this.PeerConnectionService.peerConnection.getStats(track).then((result) => {
          result.forEach(data => {
            if (data.type == "inbound-rtp") {
              this.callQualityIndicator(data.jitter);
            }
          })
        })
      }
    }

  }
  private callQualityIndicator(value: number) {
    if (value === 0) {
      this.selectIconForIndicator =
        '../../../assets/images/callInterface/green.svg';
    } else if (value >= 0.001 && value < 0.005) {
      this.selectIconForIndicator =
        '../../../assets/images/callInterface/yellow.svg';
    } else if (value > 0.005) {
      this.selectIconForIndicator =
        '../../../assets/images/callInterface/red.svg';
    }
  }
  ngOnInit(): void {
    setInterval(() => {
      this.indicatorfunction()
    }, 1000)
  }
}
