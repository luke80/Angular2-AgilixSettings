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
  private sub;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {

  }

  login(formValues) {
    this.authService.doLogin(formValues.userName, formValues.password, formValues.userspace)
      .subscribe(
        currentUser => this.authService.currentUser,
        error => console.error("Error: ", error),
        () => {
          this.router.navigate(['welcome']);
        }
      );
  }
  initiateCasLogin() {
    this.authService.initiateCasLogin(this.userspace)
  }

  cancel() {
    this.router.navigate(['welcome'])
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(
      params => { 
        if(params['token']) {
          this.authService.setCookie("sso_token", params['token']);
          if(this.authService.currentUser) {
            this.authService.currentUser.token = params['token'] || ""
          }
        }
      }
    );
    if(this.authService.getCookie("sso_token") != "" || (this.authService.currentUser && this.authService.currentUser.token)) {
      this.authService.authCasToken((this.authService.currentUser)?this.authService.currentUser.token:this.authService.getCookie("sso_token"))
        .subscribe(
          currentUser => this.authService.currentUser,
          error => console.error("Error: ", error),
          () => {
            if(this.authService.currentUser)
              this.authService.setCookie("sso_token", this.authService.currentUser.token, 2);
            this.router.navigate(['welcome'])
          }
      );
    }
    if(this.authService.currentUser && this.authService.currentUser.token && !this.authService.relogin)
      this.router.navigate(['welcome']);
  }
}
