import { Routes } from '@angular/router';

import { WelcomeComponent } from './welcome.component'
import { DomainListComponent } from './domain-list.component'
import { LoginComponent } from './login.component'
import { MaterialDemoComponent } from './material-demo/material-demo.component'

import { AuthRouteActivator } from './services/auth-route-activator.service'

export const appRoutes:Routes = [
  { path: 'welcome', component: WelcomeComponent, canActivate: [ AuthRouteActivator ] },
  { path: 'list-domains', component: DomainListComponent, canActivate: [ AuthRouteActivator ] },
  { path: 'demo', component: MaterialDemoComponent },
  { path: 'login?token=:token', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full'},
];