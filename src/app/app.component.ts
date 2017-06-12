import { Component, Optional } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { AuthService } from './services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isDarkTheme = false;
  lastLoginResult: string;

  constructor(private authService:AuthService, private _dialog: MdDialog) {

  }
  
  openLogin() {
    const dialogRef = this._dialog.open(LoginDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.lastLoginResult = result;
    })
  }
}



@Component({
  template: `
    <p>Login</p>
    <p>
      <md-input-container>
        <input mdInput placeholder="Login" />
      </md-input-container>
      <md-input-container>
        <input type="password" mdInput placeholder="Password" />
      </md-input-container>
    </p>
    <p> <button md-button (click)="dialogRef.close(loginInput.value)">Cancel</button> </p>
  `,
})

export class LoginDialogComponent {
  constructor( @Optional() public dialogRef: MdDialogRef<LoginDialogComponent>) { }
}