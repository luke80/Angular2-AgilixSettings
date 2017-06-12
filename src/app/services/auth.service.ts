import { Injectable } from '@angular/core'

import { IUser } from '../models/user.model'

@Injectable()

export class AuthService {
  currentUser:IUser

  loginUser(userName: string, password: string) {
    this.currentUser = {
      userName:userName,
      firstName: 'Luke',
      lastName: 'R.',
      userspace: 'byuis'
    }
  }

  isAuthenticated() {
    return (!!this.currentUser && !!this.currentUser.token);
  }
}