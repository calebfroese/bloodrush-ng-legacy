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
    @Input() seasonId?: number = null;
    @Input() teamId?: string = null;
    score: any;
    ratio: number = 0;


    constructor(private api: ApiService, private acc: AccountService, private scoreService: ScoreService) { }

    ngOnInit(): void {
        if (!this.teamId) {
            this.teamId = this.acc.team.id;
        }
        // Load the team stats
        this.api.run('get', `/teams/score`, `&leagueId=${this.leagueId}&seasonId=${this.seasonId}&teamId=${this.teamId}`, {})
            .then(response => {
                let teamScore = response.score;
                this.score = response.score;
                console.log('score', teamScore);
                // let t = {
                //     team: team,
                //     score: teamScore,
                //     ratio: this.scoreService.calculateRatio(teamScore),
                //     pts: this.scoreService.calculatePoints(teamScore)
                // };
                // this.teams.push(t);
                // this.sortByPoints();
                // return;
            });
    }
}
