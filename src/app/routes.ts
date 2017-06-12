import { Routes } from '@angular/router';

import { WelcomeComponent } from './welcome.component'
import { LoginComponent } from './login.component'
import { MaterialDemoComponent } from './material-demo/material-demo.component'

export const appRoutes:Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full'},
  { path: 'demo', component: MaterialDemoComponent },
  { path: 'login', component: LoginComponent }
];