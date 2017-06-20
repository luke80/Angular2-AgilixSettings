import 'hammerjs';

import { NgModule } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DialogContentComponent } from './material-demo/material-demo.component';
import { WelcomeComponent } from './welcome.component';
import { LoginComponent } from './login.component';
import { DomainListComponent } from './domain-list.component';
import { MaterialDemoComponent } from './material-demo/material-demo.component';

//import { MenuComponent } from './menu/menu.component';
import { AuthService } from './services/auth.service';
import { RequestService } from './services/request.service';

import { appRoutes } from './routes';
import { AuthRouteActivator } from './services/auth-route-activator.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent, DialogContentComponent,
    WelcomeComponent,
    MaterialDemoComponent,
    LoginComponent,
    DomainListComponent
    //,MenuComponent
  ],
  providers: [
    AuthService,
    RequestService,
    AuthRouteActivator,
    Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  entryComponents: [ DialogContentComponent ],
  bootstrap: [ AppComponent ],
})
export class AppModule { }
