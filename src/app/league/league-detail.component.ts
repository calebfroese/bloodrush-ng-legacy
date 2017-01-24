import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { MongoService } from './../mongo/mongo.service';
import { AccountService } from './../shared/account.service';

@Component({
    templateUrl: './league-detail.component.html'
})
export class LeagueDetailComponent implements OnInit {
    leagueId: string;
    league: any;
    seasons: any[];

    constructor(private mongo: MongoService, private route: ActivatedRoute, private acc: AccountService) { }

    ngOnInit(): void {
        // Load the league specified
        this.route.params.forEach((params: Params) => {
            this.leagueId = params['leagueId'];
            this.mongo.run('leagues', 'oneById', { _id: this.leagueId })
                .then(league => {
                    this.league = league;
                    return this.mongo.run('seasons', 'allByLeague', { leagueId: this.leagueId });
                })
                .then(seasons => this.seasons)
                .catch(err => {
                    debugger;
                });
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
}
