import { Component, OnInit } from '@angular/core';

import { MongoService } from './../../mongo/mongo.service';
import { AccountService } from './../../shared/account.service';

@Component({
    templateUrl: './my-team.component.html'
})
export class MyTeamComponent implements OnInit {
    team: any;

    constructor(
        private acc: AccountService,
        private mongo: MongoService
    ) { }

    ngOnInit(): void {
        // Upon page init, load the team data
        this.loadTeam();
    }

    loadTeam(): void {
        this.mongo.run('teams', 'oneByOwner', { ownerId: this.acc.loggedInAccount._id })
        .then(team => {
            this.team = team;
        })
        .catch(err => {
            debugger
        });
    }
}
