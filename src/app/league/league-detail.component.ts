import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { environment } from './../../environments/environment';
import { Config } from './../shared/config';
import { ApiService } from './../shared/api/api.service';
import { AccountService } from './../shared/account.service';

@Component({
    templateUrl: './league-detail.component.html'
})
export class LeagueDetailComponent implements OnInit {
    leagueId: string;
    league: any;
    seasons: any[];

    constructor(private api: ApiService, private route: ActivatedRoute, private acc: AccountService) { }

    ngOnInit(): void {
        // Load the league specified
        this.route.params.forEach((params: Params) => {
            this.leagueId = params['leagueId'];
            this.fetchLeague()
                .switchMap(() => { return this.fetchSeasons(); })
                .subscribe(() => {
                    console.log('all fethced and set')
                });
        });
    }

    fetchLeague(): Observable<any> {
        if (!this.leagueId) return;
        return this.api.run('get', `/leagues/${this.leagueId}`, '', {})
            .map(league => {
                this.league = league;
            })
    }

    fetchSeasons(): Observable<any> {
        if (!this.leagueId) return;
        return this.api.run('get', `/leagues/${this.leagueId}/seasons`, '', {})
            .map(seasons => this.seasons)
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
        // if (!this.leagueId) return;
        // this.mongo.run('leagues', 'generateSeason', { _id: this.leagueId })
        //     .then(res => {
        //         alert('Season generated');
        //     })
        //     .catch(err => {
        //         console.error(err);
        //         alert('Error!' + err);
        //     });
    }
}
