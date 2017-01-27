import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { FormService } from './../../shared/forms/form.service';
import { MongoService } from './../../mongo/mongo.service';
import { AccountService } from './../../shared/account.service';

@Component({
    templateUrl: './league-create.component.html'
})
export class LeagueCreateComponent {
    form: FormGroup
    newLeague = {
        public: true,
        name: ''
    };

    constructor(private mongo: MongoService, private acc: AccountService, private router: Router, private formService: FormService) {
        this.form = this.formService.leagueCreate();
    }

    /**
     * Creates a league with you as the owner
     */
    create(val: any): void {
        this.mongo.run('leagues', 'create', { name: val.name, public: val.public, ownerId: this.acc.loggedInAccount.team._id })
            .then(() => {
                this.acc.loadLeagues(); // refresh the local saved leagues
                console.log('Successfully created league!');
                this.router.navigate(['/leagues']);
            })
            .catch(err => {
                debugger;
            });
    }
}
