import { Component, Optional } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import {Subscription} from 'rxjs/Subscription';

import { AuthService } from './services/auth.service'
import { DataEmitterService } from  './services/data-emitter.service';

import { IUser } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  private isDarkTheme = false;
  private selectedDomain = "";
  private subscription: Subscription;

  constructor(private dialog: MdDialog, private authService: AuthService, private dataService: DataEmitterService) {
    this.subscription = this.dataService.emitter.subscribe(data => {
      console.log("app.component data subscription: ", data);
      if(!!data && !!data['domain-name']) {
        this.selectedDomain = data['domain-name'];
      }
    })
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      //this.lastLoginResult = result;
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