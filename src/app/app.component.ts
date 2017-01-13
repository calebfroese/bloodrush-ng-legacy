import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from './shared/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router, private acc: AccountService) { }
}
