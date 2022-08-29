import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  PeerMiniCameraScreen,
  agentOperationInformationModel
} from 'src/app/models/callInterfaceModel';
import {
  miniCameraFullName,
  minimizeMiniCameraScreen,
  minimizeMiniCameraScreenInitials,
  minimizeSplitIcon,
  normalMiniCameraFullName,
  normalMinicameraScreen,
  normalMinimizeCameraScreenInitials,
  normalSplitIcon
} from '../callsInterfaceData';

@Component({
  selector: 'app-mini-camera-screen',
  templateUrl: './mini-camera-screen.component.html',
  styleUrls: ['./mini-camera-screen.component.scss']
})
export class MiniCameraScreenComponent implements OnInit {
  @Input() PeerMiniCameraDetails!: PeerMiniCameraScreen;
  @Input() agentOperationInformation!: agentOperationInformationModel;

  minimizeMiniCameraScreenData = minimizeMiniCameraScreen;
  normalMiniCameraScreenData = normalMinicameraScreen;
  minimizeSplitIconData = minimizeSplitIcon;
  normalSplitIconData = normalSplitIcon;

  miniCameraFullNameData = miniCameraFullName;
  normalMiniCameraFullNameData = normalMiniCameraFullName;

  minimizeMiniCameraScreenInitialsData = minimizeMiniCameraScreenInitials;
  normalMinimizeCameraScreenInitialsData = normalMinimizeCameraScreenInitials;
  @Output() splitScreenOutput = new EventEmitter();
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLMediaElement>;

  constructor() {}

  ngOnInit(): void {
  }
  // split screen
  splitScreen(event: boolean) {
    this.splitScreenOutput.emit(event);
  }

  setMiniCameraSteam(stream: MediaStream) {
    this.localVideo.nativeElement.srcObject = null;
    this.localVideo.nativeElement.srcObject = stream;
  }
}
