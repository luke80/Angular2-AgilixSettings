import { Component } from '@angular/core'
import { Router } from '@angular/router'

import { AuthService } from './services/auth.service'

@Component({
  templateUrl: 'login.component.html',
  styles: [`
    .form-group {
      position: relative;
      margin: 1em auto;
    }
    em {
      position:absolute;top:0;right:0;
      color:#E05C65;
      padding-left: 10px;
    } 
  `]
})

export class LoginComponent {
  public userspace: string = 'byuis';
  public userspaces = [
    {domainId: 1, domainTitle: 'Main Domain', domain: 'domain'},
    {domainId: 2, domainTitle: 'Other Domain', domain: 'something'},
    {domainId: 3, domainTitle: 'Domainish', domain: 'ish'},
    {domainId: 4, domainTitle: 'Secondary Domain', domain: 'secondary'}
  ];

  constructor(private authService: AuthService, private router: Router) {

  }

  login(formValues) {
    this.authService.loginUser(formValues.userName, formValues.password)
    this.router.navigate(['welcome'])
  }

  cancel() {
    this.router.navigate(['welcome'])
  } 
}