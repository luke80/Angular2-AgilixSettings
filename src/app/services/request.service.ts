import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { IDlapResponse } from '../models/dlap-response.model';

@Injectable()

export class RequestService {
  lastResponse:IDlapResponse;
  private requestUrl = 'https://gls.agilix.com/cmd/?_format=json'+((this.authService && this.authService.currentUser)?'&token='+this.authService.currentUser.token:'');
  private requests:IDlapResponse[];
  
  constructor(private http: Http, private authService: AuthService) { this.requests = []; }

  doRequest(cmd: string, args: Object): Observable<IDlapResponse> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let requestObject = {
      request: {
        cmd: cmd
      }
    };

    console.log('token',this.authService.currentUser.token);
    this.requestUrl += '&_token='+this.authService.currentUser.token;

    for(let arg of Object.keys(args)) {
      requestObject.request[arg] = args[arg];
    }
    return this.http.post(this.requestUrl,  requestObject, options)
      .map( (response: Response) => response.json() )
      .do( data => this.requests.push(<IDlapResponse> data) )
      .do( data => console.log('data response: ', data) )
      .catch( this.error )
  }

  private error(err: Response) {
    console.error(err)
    return Observable.throw(err.json().error || 'RequestService error')
  }

  getLastResponse() {
    return this.requests[this.requests.length--];
  }
}
