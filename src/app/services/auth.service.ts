import { Injectable } from '@angular/core'
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common'
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { IUser } from '../models/user.model'

@Injectable()

export class AuthService {
  currentUser:IUser
  private loginUrl = 'https://gls.agilix.com/cmd/?_format=json';
  public relogin: Boolean = false;
  private ssoOnce = false;

  constructor(private http: Http, private location: Location) { }

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
    return this.http.post(this.loginUrl,  {
          request: {
            cmd: 'login',
            token: token
          }
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
    let ssoURI = "https://gls.agilix.com/SSOLogin?domainid=//" + userspace + "&url="+encodeURI(window.location.protocol+"//"+window.location.host)+"/login/token/%25TOKEN%25"; //  ; //  window.location.pathname
    console.log(ssoURI);
    if(!this.ssoOnce && confirm("Go go the CAS login?")) {
      this.ssoOnce = true;
      window.setTimeout("window.location.href = '"+ssoURI+"';",250);
    }
  }
}
