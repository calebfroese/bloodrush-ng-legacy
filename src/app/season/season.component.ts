import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import * as moment from 'moment';
import { environment } from './../../environments/environment';
import { ApiService } from './../shared/api/api.service';
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
    league: any;
    games: any;
    teams: any = {};
    config = Config;
    envName = environment.envName;

    constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {
        this.route.params.forEach((params: Params) => {
            this.loadSeason(params['seasonId'])
                .then(() => { this.loadTeams(); })
        });
    }

    loadSeason(seasonId): Promise<any> {
        return this.api.run('get', `/seasons/${seasonId}`, '', {})
            .then(season => { this.season = season; return; })
            .then(() => {
                return this.api.run('get', `/seasons/${this.season.id}/games`, '', {})
            })
            .then(games => {
                this.games = games;
                return this.api.run('get', `/leagues/${this.season.leagueId}`, '', {})
            })
            .then(league => {
                this.league = league;
            });
    }

    loadTeams() {
        return this.api.run('get', `/teams`, '', {})
            .then(teams => {
                teams.forEach(t => {
                    this.teams[t.id] = t;
                });
            });
    }

    momentify(date: any): string {
        return moment(date).format('LLL');
    }
}
