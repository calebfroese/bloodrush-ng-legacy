import { Component } from '@angular/core';

import { MongoService } from './../mongo/mongo.service';

@Component({
    templateUrl: './season.component.html'
})
export class SeasonComponent {
    season: any;
    teams: any;

    constructor(private mongo: MongoService) {
        this.loadSeason();
    }

    loadSeason(): void {
        this.mongo.run('seasons', 'allActive', {})
            .then(seasons => {
                let season = seasons[0];
                this.season = season;
                if (!this.season) return;
                for (let i = 0; i < this.season.games.length; i++) {
                    if (this.season.games[i]['round'] === parseInt(this.season.games[i]['round'], 10)) {
                        if (this.season.games[i]['home']) {
                            this.mongo.run('teams', 'oneById', { _id: this.season.games[i]['home'] }).then(teamHome => {
                                this.season.games[i]['home'] = teamHome;
                            });
                        } else {
                            this.season.games[i]['home'] = { name: 'Bye' };
                        }
                        if (this.season.games[i]['away']) {
                            this.mongo.run('teams', 'oneById', { _id: this.season.games[i]['away'] }).then(teamAway => {
                                this.season.games[i]['away'] = teamAway;

                            });
                        } else {
                            this.season.games[i]['away'] = { name: 'Bye' };
                        }
                    } else {
                        // Playoffs, leave names as are
                    }
                }
            }).catch(err => {
                debugger;
            });
        this.mongo.run('teams', 'all', {}).then(teamsArray => {
            this.teams = teamsArray;
        }).catch(err => {
            debugger;
        });
    }
}
