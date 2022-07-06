import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith
} from 'rxjs/operators';

@Component({
  selector: 'app-search-input-field',
  templateUrl: './search-input-field.component.html',
  styleUrls: ['./search-input-field.component.scss']
})
export class SearchInputFieldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('searchField') searchInput!: ElementRef;
  @Input() searchInputData: any;
  @Output() found = new EventEmitter();
  @Output() empty = new EventEmitter();

  searchSubscription!: Subscription;
  search!: string;

  constructor() {}

  ngAfterViewInit() {
    const search = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    );

    this.searchSubscription = search.subscribe((value: string) => {
      value = value.replace('@', '');
      if (value.trim()) {
        this.found.emit(
          this.searchInputData.items.filter((item: any) =>
            item[this.searchInputData.property]
              .toLowerCase()
              .includes(value.toLowerCase())
          )
        );
      } else {
        this.found.emit(this.searchInputData?.items);
      }
    });

    if (this.searchInputData?.value?.includes('@')) {
      this.searchInput.nativeElement.value =
        this.searchInputData.value.substring(
          this.searchInputData.value.indexOf('@') + 1
        );
      if (!this.searchInput.nativeElement.value) {
        this.searchInput.nativeElement.focus();
        this.search = '';
      } else {
        this.search = this.searchInputData.value.substring(
          this.searchInputData.value.indexOf('@')
        );
        this.searchInput.nativeElement.focus();
      }
    }
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  onChange(event: any) {
    if (event === '') {
      this.empty.emit(true);
    }
  }
}
