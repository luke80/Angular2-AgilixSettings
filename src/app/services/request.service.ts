import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';
import { IDlapResponse, IDlapRequest, IDlap } from '../models/index';

@Injectable()

export class RequestService {
  lastResponse:IDlapResponse;
  private requestUrl = 'https://gls.agilix.com/cmd/?_format=json';
  private requests:IDlap[];
  
  constructor(private http: Http, private authService: AuthService) { this.requests = []; }

  doRequest(cmd: string, args: Object): Observable<IDlapResponse> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    let requestObject = <IDlapRequest>{
      request: {
        cmd: cmd
      }
    };
    for(let arg of Object.keys(args)) {
      requestObject.request[arg] = args[arg];
    }
    let prevReq = <IDlap>this.findPrevious(requestObject)
    if(prevReq && prevReq.response) {
      return Observable.of(<IDlapResponse>prevReq.response);
    }

    return this.http.post(this.requestUrl,  requestObject, options)
      .map( (response: Response) => response.json() )
      .do( data => this.requests.push(
        <IDlap> {
          request: requestObject,
          response: <IDlapResponse>data
        }
      ) )
      //.do( data => console.log('data response: ', data) )
      .catch( this.error )
  }

  private error(err: Response) {
    console.error(err)
    return Observable.throw(err.json().error || 'RequestService error')
  }

  getLastResponse() {
    return this.requests[this.requests.length--];
  }

  findPrevious(requestObject): IDlap {
    for(let dlapi of this.requests) {
      console.log("compare:",dlapi.request,requestObject);
      if(JSON.stringify(dlapi.request) == JSON.stringify(requestObject))
        return dlapi;
    }
    return <IDlap>requestObject;
  }
}
