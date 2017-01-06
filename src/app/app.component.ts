import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from './shared/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  account: string;

  constructor(private router: Router, private acc: AccountService) {
    if (localStorage.getItem('_id')) {
      this.acc.loadAccount(localStorage.getItem('_id'))
        .then(account => {
          this.account = account;
        });
    }
  }
}
