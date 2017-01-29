import { Component } from '@angular/core';
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
    teams: any;
    config = Config;
    envName = environment.envName;

    constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {
        this.route.params.forEach((params: Params) => {
            this.loadSeason(params['seasonId'])
                .subscribe(() => { console.log('DONE! SEASON FETCHED') })
            // .map(() => {
            // Fetch the games

            // }).switchMap(games => {
            //     console.log('GAMES ARE', games);
            // for (let i = 0; i < this.season.games.length; i++) {
            //     if (this.season.games[i]['round'] === parseInt(this.season.games[i]['round'], 10)) {
            //         if (this.season.games[i]['home']) {
            //             this.mongo.run('teams', 'oneById', { _id: this.season.games[i]['home'] }).then(teamHome => {
            //                 this.season.games[i]['home'] = teamHome;
            //             });
            //         } else {
            //             this.season.games[i]['home'] = { name: 'Bye' };
            //         }
            //         if (this.season.games[i]['away']) {
            //             this.mongo.run('teams', 'oneById', { _id: this.season.games[i]['away'] }).then(teamAway => {
            //                 this.season.games[i]['away'] = teamAway;

            //             });
            //         } else {
            //             this.season.games[i]['away'] = { name: 'Bye' };
            //         }
            //     } else {
            //         // Playoffs, leave names as are
            //     }
            // }
            // })
            // .subscribe(games => {console.log(games)});
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
            })
        // this.mongo.run('teams', 'all', {}).then(teamsArray => {
        //     this.teams = teamsArray;
        // }).catch(err => {
        //     console.error(err);
        //     debugger;
        // });
    }

    momentify(date: any): string {
        return moment(date).format('LLL');
    }
}
