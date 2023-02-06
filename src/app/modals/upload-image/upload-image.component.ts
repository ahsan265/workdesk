/* eslint-disable no-undef */
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { component_data, OverlayService } from '@gigaaa/gigaaa-components';
import { ImageTransform } from 'ngx-image-cropper';
import { AgentService } from 'src/app/agents/agentService/agent.service';
import { AgentList } from 'src/app/models/agentSocketModel';
import { ImageCropperComponent } from 'src/app/uploadImages/image-cropper/image-cropper.component';
import { AgentInviteService } from 'src/app/workdeskServices/agentInviteService/agent-invite.service';
import { SharedServices } from 'src/app/workdeskServices/sharedResourcesService/shared-resource-service.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit, OnDestroy {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  filename: any;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  autoTicks = false;
  showTicks = false;
  step = 5;
  thumbLabel = false;
  value = 0;
  vertical = false;
  tickInterval = 1;
  zoomoutnumber = 0;
  zoominnumber = 100;
  zoomvalue: any = 0;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  imagesfile: any;
  uploadpicture: any;
  loadpicture: any;
  croppicture: any;
  progressbarvalue: any = 0;
  filesize: any;
  imageUploaded: any;
  constructor( @Inject(component_data) public data: AgentList, private OverlayService: OverlayService,private AgentService:AgentService) { }
  showSaveButton: boolean = false;
  showCancelButton: boolean = true;
  @ViewChild('ImageCropperComponent') ImageCropperComponent!: ImageCropperComponent;

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.uploadpicture = true;
    this.loadpicture = false;
    this.croppicture = false;
  }
  getImageOutput(event: any) {
    console.log(event)
    this.getFile(event);
  }

  bytesToSize(bytes: any) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0,
      n = parseInt(bytes, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
  }
  saveFiles(files: FileList) {
    if (files.length > 1) {
    }
  }
  // get picture tranisition
  uploadpictuetransition(val: boolean) {
    if (val == true) {
      this.uploadpicture = true;
      this.loadpicture = false;
      this.croppicture = false;
    } else if (val == false) {
      this.uploadpicture = false;
      this.loadpicture = false;
      this.croppicture = false;
    }
  }
  filesDropped(event: any): void {
    this.filename = event[0].file.name;

    this.bytesToSize;
    //this.fileChangeEvent(event)
    this.uploadpicture = false;
    this.croppicture = false;
    this.imageChangedEvent = event[0].url;
    this.loadpicture = true;

    setInterval(() => {
      if (this.progressbarvalue != 100) {
        this.progressbarvalue += 1;
      }
      if (this.progressbarvalue == 100) {
        if (this.loadpicture == true) {
          this.uploadpicture = false;
          this.loadpicture = false;
          this.croppicture = true;
        }
      }
    }, 50);
  }

  getFile(event: any): void {
    this.filename = event.target.files[0].name;
    this.filesize = this.bytesToSize(event.target.files[0].size);
    this.uploadpicture = false;
    this.croppicture = false;
    // const reader = new FileReader();
    // reader.readAsDataURL(event);
    // reader.onload = () => {
    //   this.imageUploaded = reader.result;
    // };
    this.loadpicture = true;

    setInterval(() => {
      if (this.progressbarvalue != 100) {
        this.progressbarvalue += 1;
      }
      if (this.progressbarvalue == 100) {
        if (this.loadpicture == true) {
          this.uploadpicture = false;
          this.loadpicture = false;
          this.croppicture = true;
          this.showCancelButton = false;
          this.showSaveButton = true;
          this.imageUploaded=event;

        }
      }
    }, 50);
  }

  closeImageModal() {
    this.OverlayService.close();
  }

  saveImageUpload() {
    (this.AgentService.checkIsLoggedInAgent(this.data.email))?
    this.ImageCropperComponent.updateUserProfilePicture():
     this.ImageCropperComponent.agentupdateuserprofilepic(this.data.uuid);
  }
}
