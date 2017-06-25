import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { AuthService } from './services/auth.service';
import { RequestService } from './services/request.service';
import { IDlapResponse } from './models/dlap-response.model';

@Component({
  templateUrl: './domain-list.component.html'
})

export class DomainListComponent implements OnInit {
  private domainResponse: IDlapResponse;

  constructor( private requestService: RequestService, private router: Router, private authService: AuthService ) {

  }

  ngOnInit() {
    //this.events = this.route.snapshot.data['events']
    this.requestService.doRequest('listdomains', {domainid:0,limit:1000}).subscribe(
      data => this.domainResponse = data.response.domains,
      resp => { this.domainResponse = resp}
    );
  }
}