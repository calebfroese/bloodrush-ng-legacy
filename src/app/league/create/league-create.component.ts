import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { FormService } from './../../shared/forms/form.service';
import { ApiService } from './../../shared/api/api.service';
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

    constructor(private api: ApiService, private acc: AccountService, private router: Router, private formService: FormService) {
        this.form = this.formService.leagueCreate();
    }

    /**
     * Creates a league with you as the owner
     */
    create(val: any): void {
        if (!this.acc.team.init) {
            alert('You cannot create a team until you have set your team colors and style.');
            this.router.navigate(['/home']);
            return;
        }
        this.api.run('patch', `/leagues`, '', {
            name: val.name,
            public: val.public,
            ownerId: this.acc.teamId,
        }).subscribe(() => {
            alert('League added');
            this.acc.loadLeagues(this.acc.teamId); // refresh the leagues
            this.router.navigate(['/leagues']);
        });
    }
}
