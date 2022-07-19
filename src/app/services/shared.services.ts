import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServices  {
    LoadcommonEpsubject = new Subject();

    constructor(){

    }

    // load common eps 
    loadCommonEps(val:number)
    {
    this.LoadcommonEpsubject.next(val)
    }
}
