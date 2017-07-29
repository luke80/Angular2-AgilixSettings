import { Router, ActivatedRoute, ActivatedRouteSnapshot, CanActivate } from '@angular/router'
import { Injectable } from '@angular/core'

import { AuthService } from './auth.service'

@Injectable()

export class AuthRouteActivator implements CanActivate {
  private sub;

  constructor(private authService: AuthService, private router:Router, private route: ActivatedRoute) {

  }

  canActivate(route:ActivatedRouteSnapshot) {
    if(this.authService.isAuthenticated())
      return true;

    let token = this.getQueryStringValue("token");
    console.log("checking route:",token,window.location);
    if(!!token) {
      this.sub = this.authService.authCasToken(token).subscribe();
    }

    if(!this.authService.isAuthenticated()) {
      if(!this.authService.checkCookie()) {
        //console.log('authService isAuthenticated():',this.authService.isAuthenticated(),window.location.pathname);
        this.authService.setCookie("pre-auth_path", window.location.pathname);
        return false;
      } else {
        let cookie = this.authService.getCookie("sso_token");
        if(!!cookie && cookie != "" && cookie != "deleted") {
          //console.log('authService:cookie isAuthenticated():',this.authService.isAuthenticated(),window.location.pathname);
          return true;
        }
      }
    }

    return true;
  }

  getQueryStringValue(key) {  
	  return encodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
  }
}