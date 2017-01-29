import { Component, OnInit, Input } from '@angular/core';

import { AccountService } from './../shared/account.service';
import { ApiService } from './../shared/api/api.service';
import { ScoreService } from './../shared/score.service';

@Component({
    selector: 'bloodrush-team-stats',
    templateUrl: './team-stats.component.html'
})
export class TeamStatsComponent implements OnInit {
    @Input() leagueId?: string = null;
    @Input() seasonNumber?: number = null;
    @Input() teamId?: string = null;
    score: any;
    ratio: number = 0;


    constructor(private api: ApiService, private acc: AccountService, private scoreService: ScoreService) { }

    ngOnInit(): void {
        // if (!this.acc.team.leagues || !this.acc.team.leagues[0]) return;
        // // Defaults
        // if (!this.leagueId) {
        //     this.leagueId = this.acc.team.leagues[0].id;
        // }
        // if (!this.teamId) {
        //     this.teamId = this.acc.team.id;
        // }

        // // Load the team stats
        // this.mongo.run('seasons', 'getScore', {leagueId: this.leagueId, seasonNumber: this.seasonNumber, teamId: this.teamId})
        // .then(score => {
        //     this.ratio = this.scoreService.calculateRatio(score);
        //     this.score = score;
        // })
        // .catch(err => {
        //     console.error(err);
        //     debugger;
        // })
    }
}