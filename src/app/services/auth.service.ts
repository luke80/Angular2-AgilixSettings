import { Injectable } from '@angular/core'
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

  constructor(private http: Http) { }

  doLogin(userName: string, password: string, userspace: string = 'byuis'): Observable<IUser> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
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

  private error(err: Response) {
    console.error(err)
    return Observable.throw(err.json().error || 'AuthService error')
  }

  isAuthenticated() {
    return (!!this.currentUser && !!this.currentUser.token);
  }
}
