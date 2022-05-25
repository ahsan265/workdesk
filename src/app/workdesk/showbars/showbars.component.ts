import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-showbars',
  templateUrl: './showbars.component.html',
  styleUrls: ['./showbars.component.css']
})
export class ShowbarsComponent implements OnInit {
  @ViewChild ('bars') bars:ElementRef<HTMLElement>;
  @Input() numberofbar:any;
  @Input() active:any;

  constructor(private render:Renderer2) { }

  ngOnInit(): void {
    console.log(this.numberofbar)
  }
  getArray(number:any)
  {
    return Array(number);
  }
}
