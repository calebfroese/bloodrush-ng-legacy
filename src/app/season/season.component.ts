import { Component, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';

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
    games: any;
    teams: any = {};
    config = Config;
    envName = environment.envName;

    constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, private zone: NgZone) {
        this.route.params.forEach((params: Params) => {
            this.loadSeason(params['seasonId'])
                .subscribe(() => { this.loadTeams(); this.zone.run(() => {}); })
        });
    }

    loadSeason(seasonId): Observable<any> {
        return this.api.run('get', `/seasons/${seasonId}`, '', {})
            .map(season => { this.season = season; return; })
            .switchMap(() => {
                return this.api.run('get', `/seasons/${this.season.id}/games`, '', {})
            })
            .map(games => {
                this.games = games;
                this.zone.run(() => {});
            });
    }

    loadTeams() {
        return this.api.run('get', `/teams`, '', {})
            .subscribe(teams => {
                teams.forEach(t => {
                    this.teams[t.id] = t;
                });
                this.zone.run(() => {});
            });
    }

    momentify(date: any): string {
        return moment(date).format('LLL');
    }
}
