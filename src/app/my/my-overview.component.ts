import { Component } from '@angular/core';

import { Config } from './../shared/config';
import { MongoService } from './../mongo/mongo.service';
import { AccountService } from './../shared/account.service';

@Component({
    templateUrl: './my-overview.component.html'
})
export class MyOverviewComponent {

    constructor(
        private acc: AccountService,
        private mongo: MongoService
    ) { }
}
