import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Config } from './shared/config';
import { AccountService } from './shared/account.service';

@Component({
  selector: 'bloodrush-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  showMobileNav = false;
  config = Config;

  constructor(private router: Router, private acc: AccountService) { }
  
  toggleMobNav(): void {

  }
}
