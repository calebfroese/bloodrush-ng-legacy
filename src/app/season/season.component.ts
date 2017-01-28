import { Component } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { environment } from './../../environments/environment';
import { MongoService } from './../mongo/mongo.service';
import { Config } from './../shared/config';

@Component({
    templateUrl: './season.component.html',
    styles: [`
        .team-icon {
            display: inline-block;
            vertical-align: middle;
        }
        .team-icon-parent {
            margin: 0px 12px 0px 0px;
        }
        table .small {
            width:auto;
            text-align:right;
            white-space: nowrap
        }
        table  {
            border-collapse:collapse;
            border-spacing:0;
            width:100%;
        }
        .tag {
            float: right;
        }
    `]
})
export class SeasonComponent {
    season: any;
    teams: any;
    config = Config;
    envName = environment.envName;

    constructor(private mongo: MongoService, private router: Router) {
        this.loadSeason();
    }

    loadSeason(): void {
        this.mongo.run('seasons', 'allActive', {})
            .then(seasons => {
                let season = seasons[0];
                this.season = season;
                if (!this.season) return;
                console.log(this.season)
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
                console.error(err);
                debugger;
            });
        this.mongo.run('teams', 'all', {}).then(teamsArray => {
            this.teams = teamsArray;
        }).catch(err => {
            console.error(err);
            debugger;
        });
    }

    momentify(date: any): string {
        return moment(date).format('LLL');
    }
}
