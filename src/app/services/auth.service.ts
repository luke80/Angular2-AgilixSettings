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
  public authenticated = false;

  constructor(private http: Http, private location: Location) { }

  ngOnInit() {
    let cookieToken = this.getCookie("sso_token");
    if(!!cookieToken && cookieToken != "" && cookieToken != "deleted") {
      console.log("Attempting to use cookie value to authenticate with CAS... ",cookieToken);
      this.authCasToken(cookieToken);
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
      .do( data => {
        if(data.response && data.response.user) {
          this.currentUser = <IUser> data.response.user
          this.authenticated = true;
        }
      } )
      .do( () => console.log('loginUser currentUser: ',this.currentUser) )
      .catch( this.error )
  }

  //  todo: test token timeout - refresh
  authCasToken(token:string): Observable<IUser> {
    console.log("authCasToken: ",token);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(this.loginUrl.replace(/(cmd\/)/i,'$1login'),  {
      _token: token
    }, options)
      .map( (response: Response) => response.json() )
      .do( data => {
        if(data.response && data.response.user) {
          this.currentUser = <IUser> data.response.user;
          this.authenticated = true;
        } else {
          this.deleteCookie("sso_token")
        }
      } )
      //.do( () => console.log('loginUser currentUser: ',this.currentUser) )
      .catch( this.error )
  }

  private error(err: Response): Observable<any> {
    console.error(err)
    return Observable.throw(err.json().error || 'AuthService error')
  }

  isAuthenticated() {
    return this.authenticated;
  }

  initiateCasLogin(userspace: string) {
    var preAuthPath = this.getCookie("pre-auth_path").replace(/^[\/\\]/,"");
    let ssoURI: string = "https://gls.agilix.com/SSOLogin?domainid=//" + userspace + "&url="+encodeURI(window.location.protocol+"//"+window.location.host)+"/"+((!!preAuthPath && preAuthPath != "")?preAuthPath:"login")+"?token%3D%25TOKEN%25"; //  ; //  window.location.pathname
    if(!this.ssoOnce) {
      this.ssoOnce = true;
      console.log("sending window to ",ssoURI);
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
    //console.error("cookie not found", cname);
    return null;
  }
  setCookie(cname, cvalue, exdays=2) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }
  deleteCookie(cname) {
    let expires = "expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = cname + "=deleted" + "; " + expires;
  }
  checkCookie(): Boolean {
    let cookie = this.getCookie("sso_token");
    if(!!cookie && cookie != "deleted") {
      this.authCasToken(cookie)
        .subscribe(
          currentUser => this.currentUser,
          error => console.error("Error: ", error),
          () => {
            if(this.currentUser) {
              this.setCookie("sso_token", this.currentUser.token);
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
    } else
      return false;
  }
}
