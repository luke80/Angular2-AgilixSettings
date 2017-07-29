import { Routes } from '@angular/router';

import { WelcomeComponent } from './welcome.component'
import { DomainListComponent } from './domain-list.component'
import { LoginComponent } from './login.component'
import { MaterialDemoComponent } from './material-demo/material-demo.component'
import { CourseListComponent } from './course-list.component'
import { CourseSearchComponent } from './course-search.component'

import { AuthRouteActivator } from './services/auth-route-activator.service'

export const appRoutes:Routes = [
  { path: 'domain/:domainid/search-courses/:operation', component: CourseSearchComponent, pathMatch: 'full' },
  { path: 'domain/:domainid', component: CourseListComponent, pathMatch: 'full' },
  { path: 'list-domains', component: DomainListComponent, canActivate: [ AuthRouteActivator ], pathMatch: 'full' },
  { path: 'demo', component: MaterialDemoComponent, pathMatch: 'full' },
  { path: 'login?token=:token', component: LoginComponent },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent, canActivate: [ AuthRouteActivator ], pathMatch: 'full' },
  { path: '', redirectTo: '/welcome', pathMatch: 'full'},
];