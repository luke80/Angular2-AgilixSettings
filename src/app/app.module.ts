import 'hammerjs';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DialogContentComponent } from './material-demo/material-demo.component';
import { WelcomeComponent } from './welcome.component';
import { MaterialDemoComponent } from './material-demo/material-demo.component';

//import { MenuComponent } from './menu/menu.component';
import { AuthService } from './services/auth.service'

import { appRoutes } from './routes';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent, DialogContentComponent,
    WelcomeComponent,
    MaterialDemoComponent
    //,MenuComponent
  ],
  providers: [
    AuthService
  ],
  entryComponents: [DialogContentComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
