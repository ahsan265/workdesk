import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  public user: BehaviorSubject<User>;
  token: any;
  pageTitle = new ReplaySubject(1);

  constructor() {
    this.user = new BehaviorSubject(this.getLoggedUser());
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('gigaaa-user');
  }

  public getLoggedUser(): User {
    const user: any = localStorage.getItem('gigaaa-user');
    return JSON.parse(user);
  }

  canActivate() {
    return this.isLoggedIn();
  }
}
