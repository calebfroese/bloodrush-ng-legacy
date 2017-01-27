import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { environment } from './../../environments/environment';
import { Config } from './../shared/config';
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
            this.fetchLeague();
        });
    }

    fetchLeague(): void {
        if (!this.leagueId) return;
        this.mongo.run('leagues', 'oneById', { _id: this.leagueId })
            .then(league => {
                this.league = league;
                return this.mongo.run('seasons', 'allByLeague', { leagueId: this.leagueId });
            })
            .then(seasons => this.seasons)
            .catch(err => {
                debugger;
            });
    }

    /**
     * Enrolls a user in a league
     */
    enroll(id: string): void {
        // // Make sure the user cannot enrol if they have not yet created team colours
        // if (!this.acc.team.init) {
        //     alert('You cannot enrol in a league until you have set your team colors and logo.');
        //     return;
        // }

        // this.mongo.run('leagues', 'addTeam', { teamId: this.acc.team.id, leagueId: id })
        //     .then(() => {
        //         // this.acc.loadLeagues(); // refresh the local saved leagues
        //         this.fetchLeague(); // refresh the league to display the user as enrolled in
        //     })
        //     .catch(err => {
        //         console.error(err);
        //         alert('Error!' + err);
        //     });
    }

    generateSeason(): void {
        if (!this.leagueId) return;
        this.mongo.run('leagues', 'generateSeason', { _id: this.leagueId })
            .then(res => {
                alert('Season generated');
            })
            .catch(err => {
                console.error(err);
                alert('Error!' + err);
            });
    }
}
