import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

import {AccountService} from './../account.service';

/**
 * Prevents activating a route unless the user is logged in
 */

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(public acc: AccountService, public router: Router) {}

  public canActivate(route, state): Promise<boolean>|boolean {
    let isLoggedIn = this.acc.team && this.acc.team.id;
    if (isLoggedIn) return true;
    return this.acc.checkCachedLogin()
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        })
  }
}