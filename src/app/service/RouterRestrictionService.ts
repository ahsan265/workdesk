import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanLoad, Resolve, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router";
import { Observable } from "rxjs";
import { User } from "../model/User";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
  })
  export class restrictionservice {
    constructor(private authservice:AuthService,private route:Router) { }

    initCheck() {
      return new Promise<any>((resolve, reject) => { 
    let isActive=this.authservice.isLoggedIn();
    if(isActive)
    {
        resolve(true);
    }
    else{
      reject(false)
    }
    
    }).catch(err=>{
      console.log(err);
    })
  }
}