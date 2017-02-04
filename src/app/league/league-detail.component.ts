import { Component, OnInit, NgZone } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';

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
    teams: any[] = []; // teams belonging to the league
    seasons: any[] = [];

    constructor(private api: ApiService, private route: ActivatedRoute, private acc: AccountService, private zone: NgZone, private router: Router) { }

    ngOnInit(): void {
        // Load the league specified
        this.route.params.forEach((params: Params) => {
            this.leagueId = params['leagueId'];
            if (this.leagueId) this.fetchLeague()
                .then(() => { return this.fetchSeasons(); })
                .then(() => {
                    this.zone.run(() => {});
                    this.fetchTeams();
                });
        });
    }

    fetchLeague(): Promise<any> {
        return this.api.run('get', `/leagues/${this.leagueId}`, '', {})
            .then(league => { this.league = league; });
    }

    fetchSeasons(): Promise<any> {
        return this.api.run('get', `/leagues/${this.leagueId}/seasons`, '', {})
            .then(seasons => { this.seasons = seasons; });
    }

    fetchTeams(): void {
        this.league.teamIds.forEach(teamId => {
            return this.api.run('get', `/teams/${teamId}`, '', {})
                .then(team => { this.teams.push(team); this.zone.run(() => { }); });
        });
    }

    /**
     * Enrolls a user in a league
     */
    enroll(id: string): void {
        // Make sure the user cannot enrol if they have not yet created team colours
        if (!this.acc.team.init) {
            alert('You cannot enrol in a league until you have set your team colors and logo.');
            this.router.navigate(['/home/team/team']);
            return;
        }
        console.log('enrolling')
        this.api.run('get', `/leagues/${id}`, '', {})
            .then(league => {
                console.log('league found')
                if (league.teamIds.indexOf(this.acc.team.id) === -1) {
                    league.teamIds.push(this.acc.team.id);
                    this.api.run('patch', `/leagues/${id}`, '', league)
                        .then(leag => {
                            console.log('league updated')
                            console.log(leag)
                            this.zone.run(() => { });
                            this.acc.loadLeagues(this.acc.teamId); // refresh the local saved leagues
                            this.fetchLeague().then(() => {
                                this.fetchTeams();
                            }); // refresh the league to display the user as enrolled in
                        });
                } else {
                    alert('You are already enrolled to this league');
                }
            });
    }

    generateSeason(): void {
        if (!this.leagueId) return;
        this.api.run('post', `/leagues/generateSeason`, `&id=${this.leagueId}`, {})
            .then(res => {
                console.log(res);
                // alert(res);
            });
    }
}
