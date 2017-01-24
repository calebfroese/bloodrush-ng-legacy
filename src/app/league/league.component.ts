import { Component, OnInit } from '@angular/core';

import { MongoService } from './../mongo/mongo.service';
import { AccountService } from './../shared/account.service';

@Component({
    templateUrl: './league.component.html'
})
export class LeagueComponent implements OnInit {
    allLeagues: any;
    newLeague = {
        public: true,
        name: ''
    };

    constructor(private mongo: MongoService, private acc: AccountService) { }

    ngOnInit(): void {
        this.mongo.run('leagues', 'allPublic', {})
            .then(allLeagues => {
                console.log(allLeagues);
                this.allLeagues = allLeagues;
            })
            .catch(err => {
                debugger;
            });
    }
    /**
     * Enrolls a user in a league
     */
    enroll(id: string): void {
        this.mongo.run('leagues', 'addTeam', { teamId: this.acc.loggedInAccount.team._id, leagueId: id })
            .then(() => {
                console.log('Successfully enrolled!');
                this.acc.loadLeagues(); // refresh the local saved leagues
            })
            .catch(err => {
                debugger;
            });
    }
    /**
     * Creates a league with you as the owner
     */
    create(isPublic: boolean, name: string): void {
        this.mongo.run('leagues', 'create', { name: name, public: isPublic, ownerId: this.acc.loggedInAccount.team._id })
            .then(() => {
                this.acc.loadLeagues(); // refresh the local saved leagues
            })
            .catch(err => {
                debugger;
            });
    }
}
