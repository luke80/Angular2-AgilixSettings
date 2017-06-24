import { Injectable, OnInit } from '@angular/core'
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common'
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { IUser } from '../models/user.model'

@Injectable()

export class AuthService implements OnInit {
  currentUser:IUser
  private loginUrl = 'https://gls.agilix.com/cmd/?_format=json';
  public relogin: Boolean = false;
  private ssoOnce = false;

  constructor(private http: Http, private location: Location) { }

  ngOnInit() {
    let cookieToken = this.getCookie("sso_token");
    if(cookieToken != "") {
      this.doCasLogin(cookieToken);
    }
  }

  doLogin(userName: string, password: string, userspace: string = 'byuis'): Observable<IUser> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(this.loginUrl,  {
          request: {
            cmd: 'login',
            username: userspace + '/' + userName,
            password: password
          }
        }, options)
      .map( (response: Response) => response.json() )
      .do( data => this.currentUser = <IUser> data.response.user )
      .do( () => console.log('loginUser currentUser: ',this.currentUser) )
      .catch( this.error )
  }
  doCasLogin(token:string): Observable<IUser> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(this.loginUrl.replace(/(cmd\/)/i,'$1login'),  {
      _token: token
    }, options)
      .map( (response: Response) => response.json() )
      .do( data => this.currentUser = <IUser> data.response.user )
      .do( () => console.log('loginUser currentUser: ',this.currentUser) )
      .catch( this.error )
  }

  private error(err: Response) {
    console.error(err)
    return Observable.throw(err.json().error || 'AuthService error')
  }

  isAuthenticated() {
    return (!!this.currentUser && !!this.currentUser.token);
  }

  initiateCasLogin(userspace: string) {
    let ssoURI = "https://gls.agilix.com/SSOLogin?domainid=//" + userspace + "&url="+encodeURI(window.location.protocol+"//"+window.location.host)+"/login?token%3D%25TOKEN%25"; //  ; //  window.location.pathname
    console.log(ssoURI);
    if(!this.ssoOnce && confirm("Go go the CAS login?")) {
      this.ssoOnce = true;
      window.setTimeout("window.location.href = '"+ssoURI+"';",250);
    }
  }
  getCookie(cname): string {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return null;
  }
  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }
 checkCookie(): Boolean {
    if(this.getCookie("sso_token") != "") {
      console.log('LoginComponent token:',this.currentUser,this.getCookie("sso_token"));
      this.doCasLogin(this.getCookie("sso_token"))
        .subscribe(
          currentUser => this.currentUser,
          error => console.error("Error: ", error),
          () => {
            if(this.currentUser) {
              console.log("checkCookie!!",this.currentUser);
              this.setCookie("sso_token", this.currentUser.token, 2);
            }
            /*
            if(this.getCookie("path"))
              this.router.navigate([this.getCookie("path")])
            else
              this.router.navigate(['welcome'])
            */
          }
      );
      return true;
    }
    return false;
  }
}
