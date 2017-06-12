import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUser } from '../models/user.model';

@Component({
  selector: 'settings-menu',
  templateUrl:'menu.component.html'
})

export class MenuComponent {
  constructor(/*private user:IUser, private route:ActivatedRoute*/) {

  }

  ngOnInit() {
  }
}