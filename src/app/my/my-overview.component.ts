import {Component} from '@angular/core';
import {AccountService} from './../shared/account.service';

@Component({templateUrl: './my-overview.component.html'})
export class MyOverviewComponent {
  constructor(public acc: AccountService) {}
}
