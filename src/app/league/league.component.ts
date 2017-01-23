import { Component, OnInit } from '@angular/core';

import { MongoService } from './../mongo/mongo.service';
import { AccountService } from './../shared/account.service';

@Component({
    templateUrl: './league.component.html'
})
export class LeagueComponent implements OnInit {
    leagues: any;
    allLeagues: any;

    constructor(private mongo: MongoService, private acc: AccountService) { }

    ngOnInit(): void {
        this.mongo.run('leagues', 'allByTeam', { teamId: this.acc.loggedInAccount.team._id })
            .then(leagues => {
                this.leagues = leagues;
            })
            .catch(err => {
                debugger;
            });
        this.mongo.run('leagues', 'all', {})
            .then(allLeagues => {
                console.log(allLeagues);
                this.allLeagues = allLeagues;
            })
            .catch(err => {
                debugger;
            });
    }
}
