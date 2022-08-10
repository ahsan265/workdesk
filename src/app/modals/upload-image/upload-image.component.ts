import { Component, HostListener, OnInit } from '@angular/core';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
  base64ToFile
} from 'ngx-image-cropper';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {
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
  constructor() {}

  ngOnInit(): void {
    this.uploadpicture = true;
    this.loadpicture = false;
    this.croppicture = false;
  }
  @HostListener('dragover', ['$event']) onDragOver(event: any) {
    event.preventDefault();
  }
  @HostListener('dragenter', ['$event']) onDragEnter(event: any) {
    event.preventDefault();
  }
  @HostListener('dragend', ['$event']) onDragEnd(event: any) {
    event.preventDefault();
  }
  @HostListener('dragleave', ['$event']) onDragLeave(event: any) {
    event.preventDefault();
  }
  @HostListener('drop', ['$event']) onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      let files: FileList = event.dataTransfer.files;
      this.saveFiles(files);
    }
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
      //  this.message.setErrorMessage("Only one file is allowed")
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

  fileChangeEvent(event: any): void {
    this.filename = event.target.files[0].name;
    this.filesize = this.bytesToSize(event.target.files[0].size);
    this.uploadpicture = false;
    this.croppicture = false;
    this.imageChangedEvent = event;
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

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    // this.imagesfile = base64ToFile(event.base64);
  }

  imageLoaded() {}
  getSliderTickInterval() {}

  updateSetting(event: any) {}

  cropperReady(sourceImageDimensions: Dimensions) {}

  loadImageFailed() {}

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    if (this.zoomvalue != 0) {
      this.zoomvalue -= 10;
      this.scale -= 0.1;
      this.transform = {
        ...this.transform,
        scale: this.scale
      };
    } else {
      this.resetImage();
    }
  }

  zoomIn() {
    if (this.zoomvalue != 100) {
      this.zoomvalue += 10;
      this.scale += 0.1;
      this.transform = {
        ...this.transform,
        scale: this.scale
      };
    }
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }

  uploadprofilepicture() {
    // if (this.data?.loggedinemail == this.data?.useremail) {
    //   this.updateuserprofilepic(this.imagesfile)
    // }
    // else {
    //   this.agentupdateuserprofilepic(this.imagesfile, this.data?.uuid);
    // }
  }
  public updateuserprofilepic(file: any) {
    // const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
    // var accesstoken = getdata.api_token;
    // var subsid = getdata.subscription_id.subsid.uuid;
    // var id = JSON.parse(localStorage.getItem('intgid'));
    // this.gigaaapi.uploaduserprofilepic(accesstoken, subsid, id.int_id, file).subscribe(event => {
    //   if (event['type'] === 4) {
    //     this.shared_res.sendpictureupdated(event['body']['96'])
    //     this.message.setSuccessMessage("Profile picture updated");
    //     this.dialogRef.close();
    //   }
    // }, err => {
    //   console.log(err)
    //   this.message.setErrorMessage(err.error.error)
    // })
  }
  public agentupdateuserprofilepic(file: any, uuid: any) {
    // const getdata = JSON.parse(localStorage.getItem('gigaaa-user'))
    // var accesstoken = getdata.api_token;
    // var subsid = getdata.subscription_id.subsid.uuid;
    // var id = JSON.parse(localStorage.getItem('intgid'));
    // this.gigaaapi.agentuploaduserprofilepic(accesstoken, subsid, id.int_id, uuid, file).subscribe(event => {
    //   if (event['type'] === 4) {
    //     console.log(event['body']['96'])
    //     this.shared_res.sendpictureupdated(event['body']['96'])
    //     this.message.setSuccessMessage("Agent profile picture updated");
    //     this.dialogRef.close()
    //   }
    // }, err => {
    //   this.message.setErrorMessage(err.error.error)
    // })
  }
}
