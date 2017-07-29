import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';

import { AuthService } from './services/auth.service';
import { RequestService } from './services/request.service';
import { DataEmitterService } from './services/data-emitter.service';

import { IDlapResponse } from './models/dlap-response.model';

@Component({
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.scss']
})

export class DomainListComponent implements OnInit {
  private domainResponse: IDlapResponse;
  private filterBy: string = "";
  private visibleDomains: any[] = [];
  private sortOptions = [{
      name: "Domain title",
      property: "name"
    },{
      name: "Domain code",
      property: "userspace"
    },{
      name: "Domain creation date",
      property: "creationdate"
    },{
      name: "Domain update date",
      property: "modifieddate"
  }];
  public sortBy: string = "creationdate";
  public sortAscending: boolean = false;
  public sorting: string = "";
  
  constructor( private requestService: RequestService, private router: Router, private authService: AuthService, private http: Http, private dataService: DataEmitterService ) {

  }

  ngOnInit() {
    this.setSortingText();
    this.requestService.doRequest('listdomains', {domainid:0,limit:1000,select:"data"}).subscribe(
      data => this.domainResponse = data,
      resp => {
        //console.log("resp: ", resp )
      },
      () => {
        if(!!this.domainResponse && !!this.domainResponse.response && !! this.domainResponse.response.domains && !! this.domainResponse.response.domains.domain) {
          this.filterDomains();
          for(let domain of this.domainResponse.response.domains.domain) {
            /*  //  Demo request domain data (not needed)
            this.requestService.doRequest("getdomain2", {domainid: domain.id, select:"data"}).subscribe(
              data => {
                console.log(data);
              }
            );
            */
            domain.cq = false;
            if(!!domain.data && !!domain.data.customization) {
              if(!!domain.data.customization.customquestions) {
                domain.cq = true;
              }
              if(!!domain.data.customization.files && !!domain.data.customization.files.file && domain.data.customization.files.file instanceof Array)
                for(let file of domain.data.customization.files.file) {
                  if(file.type == "style") {
                    this.getDomainFile(domain.userspace, domain.id, file.path).subscribe(
                      data => {
                        this.parseStylesheetForLogo(data['_body'], domain);
                      }
                    );
                  }
                }
              else if(!!domain.data.customization.files && !!domain.data.customization.files.file && domain.data.customization.files instanceof Object) {
                let file = domain.data.customization.files.file;
                if(file.type == "style") {
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

  filterDomains(): void {
    if(!!this.domainResponse) {
      let domains = this.domainResponse.response.domains.domain;
      console.log("filterBy", this.filterBy);
      if(this.filterBy == "") {
        this.visibleDomains = domains.slice(0);
      } else {
        this.visibleDomains = domains.filter(
          domain => {
            return (domain.name.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) !== -1 || domain.userspace.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) !== -1);
          }
        );
      }
    }
  }

  sortDomains(): void {
    if(!!this.domainResponse) {
      let sortBy = this.sortBy;
      let high = (this.sortAscending)?-1:1;
      let low = (this.sortAscending)?1:-1;
      this.visibleDomains.sort(function(a, b) {
        if(a[sortBy].toLocaleLowerCase() > b[sortBy].toLocaleLowerCase())
          return high;
        else if(a[sortBy].toLocaleLowerCase() == b[sortBy].toLocaleLowerCase())
          return 0;
        else //  if(a[this.sortBy] < b[this.sortBy])
          return low;
      });
    }
  }
  

  getDomainFile(domain: string, domainid: number, path: string): Observable<string> {
    return this.http.get("https://"+domain+".brainhoney.com/resource/"+domainid+"/"+path)
      .do( data => { } )
      .catch( this.error )
  }

  parseStylesheetForLogo(stylesheet: string, domain: any): void {
    let regExp = /[\r\n]\s*(?:div\.welcome_header\:(?:after|before)|\.top_right_header)[\w\W]*?\sbackground(?:-image)?:.*?url\(['"']?\.{0,2}\/?([^\"')]+)['"']?\)/i;
    let el = document.getElementById(domain.userspace);
    if(regExp.test(stylesheet))  {
      let img = regExp.exec(stylesheet)[1].replace(/^\//,"").replace(/\s/g,'%20');
      if(!!el && !!img && !(/(independentstudy|byuis|agilix)/i).test(img))
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

  navigateToDomain(domain): void {
    this.dataService.setData("domain-name",domain.name);
    this.dataService.setData("domain-id",domain.id);
    this.dataService.navigateToDomain(domain);
  }

  setSortingText(): void {
      this.sorting = (this.sortAscending)?"Z-A, new to old":"A-Z, old to new";
  }
}