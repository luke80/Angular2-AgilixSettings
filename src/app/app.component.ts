import { Component, Optional } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { AuthService } from './services/auth.service'
import { IUser } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ AuthService ]
})

export class AppComponent {
  isDarkTheme = false;
  lastLoginResult: string;
  private authUser: IUser;

  constructor(private dialog: MdDialog) {

  }

  
  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.lastLoginResult = result;
    })
  }
}

@Component({
  template: `
    <p>Dialog</p>
    <p>
      <md-input-container>
        <input mdInput placeholder="Lorem Ipsum" />
      </md-input-container>
      <md-input-container>
        <input mdInput placeholder="dolor sit amet" />
      </md-input-container>
    </p>
    <p> <button md-button (click)="dialogRef.close()">Cancel</button> </p>
  `,
})

export class DialogComponent {
  constructor( @Optional() public dialogRef: MdDialogRef<DialogComponent>) { }
}