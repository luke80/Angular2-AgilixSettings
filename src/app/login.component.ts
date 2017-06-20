import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { AuthService } from './services/auth.service'
import { IUser } from './models/user.model';

@Component({
  templateUrl: 'login.component.html',
  styles: [`
    #login-cards {
      display: flex;
      align-items: stretch;
    }
    .form-group {
      position: relative;
      margin: 1em auto;
    }
    em {
      position:absolute;top:0;right:0;
      color:#E05C65;
      padding-left: 10px;
    }
    md-card {
      display: inline-block;
    }
    #cas-login button {
      width:100%;
    }
    div[vertically-aligned] {
      display: flex;
      align-items: center;
      padding: 1em;
    }
  `]
})

export class LoginComponent implements OnInit {
  private userspace: string = 'byuis';
  private userspaces = [
    {domainId: 1, domainTitle: 'Main Domain', domain: 'byuis'},
    {domainId: 2, domainTitle: 'BYU Master Courses', domain: 'byumastercourses'},
    {domainId: 3, domainTitle: 'BYUIS Production', domain: 'byuisproduction'},
    {domainId: 4, domainTitle: 'Design Sandbox', domain: 'designsandbox'}
  ];
  private token: string;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {

  }

  login(formValues) {
    this.authService.doLogin(formValues.userName, formValues.password, formValues.userspace)
      .subscribe(
        currentUser => this.authService.currentUser,
        error => console.error("Error: ", error),
        () => this.router.navigate(['welcome'])
      );
  }
  initiateCasLogin() {
    if(!this.token)
      this.authService.initiateCasLogin(this.userspace)
    else
      console.log("token set, not going to CAS");
  }

  cancel() {
    this.router.navigate(['welcome'])
  }

  ngOnInit() {
    this.token = this.route.snapshot.params['token']
    if(this.token) {
      console.log('LoginComponent token from url:',this.token);
      this.authService.doCasLogin(this.token)
      .subscribe(
        currentUser => this.authService.currentUser,
        error => console.error("Error: ", error),
        () => this.router.navigate(['welcome'])
      );
    }
    if(this.authService.currentUser && this.authService.currentUser.token && !this.authService.relogin)
      this.router.navigate(['welcome']);
  }
}