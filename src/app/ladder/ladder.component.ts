import { Component, OnInit, Input, NgZone } from '@angular/core';

import { MongoService } from './../mongo/mongo.service';
import { ScoreService } from './../shared/score.service';

@Component({
    selector: 'bloodrush-ladder',
    templateUrl: './ladder.component.html'
})
export class LadderComponent implements OnInit {
    @Input() leagueId: string;
    @Input() seasonNumber: string;
    teams: any = [];

    constructor(private mongo: MongoService, private zone: NgZone, private scoreService: ScoreService) { }

    ngOnInit(): void {
        // Load the teams
        this.loadTeams();
    }

    loadTeams(): void {
        if (!this.leagueId) return;
        this.mongo.run('leagues', 'oneById', { _id: this.leagueId })
            .then(league => {
                league.teams.forEach(teamId => {
                    this.mongo.run('teams', 'oneById', { _id: teamId })
                        .then(team => {
                            // Get the score
                            this.mongo.run('seasons', 'getScore', {
                                teamId: teamId,
                                seasonNumber: this.seasonNumber,
                                leagueId: this.leagueId
                            })
                                .then(teamScore => {
                                    let t = {
                                        team: team,
                                        score: teamScore,
                                        ratio: this.scoreService.calculateRatio(teamScore),
                                        pts: this.scoreService.calculatePoints(teamScore)
                                    };
                                    this.teams.push(t);
                                    this.sortByPoints();
                                });
                        });
                });
            });
    }

    sortByPoints(): void {
        // Sorts the array by points
        let arr = this.teams;
        arr.sort((a: any, b: any) => {
            if (b.pts < a.pts) {
                return -1;
            } else if (b.pts > a.pts) {
                return 1;
            } else {
                // Sort by least ties
                if (b.score.t > a.score.t) {
                    return -1;
                } else if (b.score.t < a.score.t) {
                    return 1;
                } else {
                    // Sort by least games played
                    if (b.score.gp > a.score.gp) {
                        return -1;
                    } else if (b.score.gp < a.score.gp) {
                        return 1;
                    } else {
                        return 0;
                    }
                }

            }
        });
        this.teams = arr;
    }
}
