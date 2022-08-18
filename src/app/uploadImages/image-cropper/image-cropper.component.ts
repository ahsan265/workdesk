import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {
  @Input() public fileName: string = '';
  @Input() public imageSize: string = ''
  @Input() public imageView: string = ''
  count = 0
  @Input('CanvasHeight') CanvasHeight!: number;
  @Input('CanvasWidth') CanvasWidth!: number;
  @Output() selected = new EventEmitter();
  width = 150;
  height = 150;
  color = '#505962b5';

  taggedItem = ""
  showInput: boolean = false;
  isMoving!: boolean;
  imgWidth!: number;
  uniX: number = 0;
  uniY: number = 0;
  uniX2: number = 0;
  uniY2: number = 0;
  initX: number = 0;
  initY: number = 0;
  imgHeight!: number;
  url!: string;
  public image: any;
  public originalImageWidth: any;
  public originalImageHeight: any;
  public hRatio: any;
  public vRatio: any;
  public translatePos = { x: this.CanvasWidth / 2, y: this.CanvasHeight / 2 };
  public scale = 1.0;
  public scaleMultiplier = 0.8;

  @ViewChild("layer1", { static: false })
  layer1Canvas!: ElementRef;
  private context!: CanvasRenderingContext2D;
  private layer1CanvasElement: any;

  constructor(private renderer: Renderer2) { }

  imageLoad() {
    this.image = new Image();
    this.image.src = this.imageView;
    this.image.onload = () => {
      console.log(this.CanvasWidth, this.CanvasHeight);
      console.log(this.image.width, this.image.height);
      this.originalImageWidth = this.image.width;
      this.originalImageHeight = this.image.height;
      this.CanvasWidth = this.image.width;
      this.CanvasHeight = this.image.height;
      this.image.width = this.CanvasWidth;
      this.image.height = this.CanvasHeight;
      this.hRatio = this.originalImageWidth / this.CanvasWidth;
      this.vRatio = this.originalImageHeight / this.CanvasHeight;
      this.layer1CanvasElement = this.layer1Canvas.nativeElement;
      this.layer1CanvasElement.width = this.CanvasWidth;
      this.layer1CanvasElement.height = this.CanvasHeight;
      this.showImage()
    }
  }


  showImage() {
    this.count++;
    this.layer1CanvasElement = this.layer1Canvas.nativeElement;
    this.context = this.layer1CanvasElement.getContext("2d");
    this.context.clearRect(0, 0, this.CanvasWidth, this.CanvasHeight);
    this.context.save();
    this.context.translate(this.translatePos.x, this.translatePos.y);
    this.context.scale(this.scale, this.scale);
    this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height);
    this.context.restore()
  }


  ngOnInit(): void {
    this.imageLoad();
  }
  zoomOut() {
    if (this.scale !== 1.0) {
      this.scale *= this.scaleMultiplier;
      this.showImage();
    }
  }
  zoomIn() {
    if (this.scale !== 1.6) {
      this.scale /= this.scaleMultiplier;
      this.showImage();
    }
  }
  dragEvent(event: MouseEvent) {
    this.renderer.listen(document, 'mouseup', (e) => {
      this.initX = e.offsetX;
      this.initY = e.offsetY;

    });
  }

  // getHeight(length: any, ratio: any) {
  //   let height = length / Math.sqrt(Math.pow(ratio, 2) + 1);
  //   return Math.round(height);
  // }

  // getWidth(length: any, ratio: any) {
  //   let width = length / Math.sqrt(1 / (Math.pow(ratio, 2) + 1));
  //   return Math.round(width);
  // }
  // crop image
  cropImages() {
    this.context.drawImage(this.image, 0, 0, this.initX, this.initY);
    this.context.restore()
  }


  expandCroppingZone(event: MouseEvent) {
    let pageX: number;
    const moveListener = this.renderer.listen(document, 'mousemove', (e) => {
      const diff = isNaN(pageX) ? 1 : e.pageX - pageX;
      const minSize = 10;

      if (
        (this.width + diff < minSize || this.height + diff < minSize) &&
        diff < 0
      ) {
        return;
      }

      this.width = this.width + diff;
      this.height = this.height + diff;

      pageX = e.pageX;
    });

    const upListener = this.renderer.listen(document, 'mouseup', (e) => {
      moveListener();
      upListener();
    });
  }

  getHeight(length:any, ratio:any) {
    let height = length / Math.sqrt(Math.pow(ratio, 2) + 1);
    return Math.round(height);
  }

  getWidth(length:any, ratio:any) {
    let width = length / Math.sqrt(1 / (Math.pow(ratio, 2) + 1));
    return Math.round(width);
  }
}
