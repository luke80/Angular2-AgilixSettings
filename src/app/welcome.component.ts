import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service'
import { IUser } from './models/user.model';

@Component({
  template: `
    <div *ngIf="!authService.isAuthenticated()">
      <h1>Please login to access this tool</h1>
      <button md-raised-button class="app-sidebar-button" [routerLink]="['/login']">
        <md-icon class="example-icon">verified_user</md-icon>
        Login            
      </button>
    </div>
    <div *ngIf="authService.isAuthenticated()">
      <h1>Welcome {{authService.currentUser?.firstname}}</h1>
    </div>
  `
})

export class WelcomeComponent implements OnInit {
  
  constructor(private authService:AuthService, private router: Router) {
  }

  ngOnInit() {

  }
}