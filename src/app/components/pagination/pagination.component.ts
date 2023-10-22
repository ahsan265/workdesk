import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() pagination: any;
  showPagination: boolean = true;
  constructor() {}
  tableSizes = [
    { value: 5, selected: false },
    { value: 10, selected: true },
    { value: 15, selected: false },
    { value: 20, selected: false }
  ];
  ngOnInit(): void {}
  onTableDataChange(event: any) {}
  onTableSizeChange(event: any) {}
}
