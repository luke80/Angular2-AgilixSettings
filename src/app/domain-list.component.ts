import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';

import { AuthService } from './services/auth.service';
import { RequestService } from './services/request.service';
import { IDlapResponse } from './models/dlap-response.model';

@Component({
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.scss']
})

export class DomainListComponent implements OnInit {
  private domainResponse: IDlapResponse;

  constructor( private requestService: RequestService, private router: Router, private authService: AuthService, private http: Http ) {

  }

  ngOnInit() {
    //this.events = this.route.snapshot.data['events']
    this.requestService.doRequest('listdomains', {domainid:0,limit:1000,select:"data"}).subscribe(
      data => this.domainResponse = data,
      resp => {
        //console.log("resp: ", resp )
      },
      () => {
        //console.log("onInit",this);
        if(!!this.domainResponse && !!this.domainResponse.response && !! this.domainResponse.response.domains && !! this.domainResponse.response.domains.domain) {
          let domains = this.domainResponse.response.domains.domain;
          for(let domain of domains) {
            //console.log("domain "+domain.name);
            if(!!domain.data && !!domain.data.customization && !!domain.data.customization.files) {
              //console.log("domain files: "+domain.name, domain.data.customization.files);
              if(domain.data.customization.files.file instanceof Array)
                for(let file of domain.data.customization.files.file) {
                  if(file.type == "style") {
                    //console.log("domain "+domain.name, file.path);
                    this.getDomainFile(domain.userspace, domain.id, file.path).subscribe(
                      data => {
                        this.parseStylesheetForLogo(data['_body'], domain);
                      }
                    );
                  }
                }
              else if(!!domain.data.customization.files.file && domain.data.customization.files instanceof Object) {
                let file = domain.data.customization.files.file;
                if(file.type == "style") {
                  //console.log("domain "+domain.name, file.path);
                  this.getDomainFile(domain.userspace, domain.id, file.path).subscribe(
                    data => this.parseStylesheetForLogo(data['_body'], domain)
                  );
                }
              }
            }
          }
        }
      }
    );
  }

  getDomainFile(domain: string, domainid: number, path: string): Observable<string> {
    return this.http.get("https://"+domain+".brainhoney.com/resource/"+domainid+"/"+path)
      .do( data => {
        //console.log("getDomainFile: ", data)
       } )
      .catch( this.error )
  }

  parseStylesheetForLogo(stylesheet: string, domain: any): void {
    let regExp = /div\.welcome_header:after[\w\W]*?background-image:.*?url\(['"']?\.{0,2}\/?([^\"')]+)['"']?\)/i;
    let el = document.getElementById(domain.userspace);
    if(regExp.test(stylesheet)) {
      let img = regExp.exec(stylesheet)[1];
      if(!!img)
        el.style.backgroundImage = "url(https://"+domain.userspace+".brainhoney.com/resource/"+domain.id+"/"+img+")";
    }
  }

  private error(err: Response) {
    console.error(err)
    return Observable.throw(err.json().error || 'RequestService error')
  }

  getDomainLogoBackgroundStyle(domain: any): any {
    return {"background-image": "url(https://"+domain.userspace+".brainhoney.com/resource/"+domain.id+"/"+domain.titleBgImage+")"};
  }
}