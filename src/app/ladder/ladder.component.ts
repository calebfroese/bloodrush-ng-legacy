import { Component, OnInit, Input } from '@angular/core';

import { MongoService } from './../mongo/mongo.service';

@Component({
    selector: 'bloodrush-ladder',
    templateUrl: './ladder.component.html'
})
export class LadderComponent implements OnInit {
    @Input() leagueId: string;
    @Input() seasonNumber: string;
    teams: any = [];

    constructor(private mongo: MongoService) { }

    ngOnInit(): void {
        // Load the teams
        this.loadTeams();
    }

    loadTeams(): void {
        if (!this.leagueId) return;
        this.mongo.run('leagues', 'oneById', { _id: this.leagueId })
            .then(league => {
                console.log(league);
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
                                        score: teamScore
                                    };
                                    console.log(teamScore)
                                    this.teams.push(t);
                                });
                        });
                });
            });
    }
}
