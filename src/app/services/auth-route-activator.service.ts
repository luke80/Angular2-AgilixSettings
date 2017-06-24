import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router'
import { Injectable } from '@angular/core'

import { AuthService } from './auth.service'

@Injectable()

export class AuthRouteActivator implements CanActivate {
  constructor(private authService: AuthService, private router:Router) {

  }

  canActivate(route:ActivatedRouteSnapshot) {
    console.log('authService isAuthenticated():',this.authService.isAuthenticated(),window.location.pathname);
    if(!this.authService.isAuthenticated()) {
      if(!this.authService.checkCookie()) {
        this.router.navigate(['/login']);
        return false;
      } else return true;
    }

    return true;
  }
}