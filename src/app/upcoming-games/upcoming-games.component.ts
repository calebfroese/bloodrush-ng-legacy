import { Component, Input, OnInit } from '@angular/core';

import { ApiService } from './../shared/api/api.service';
import * as moment from 'moment';

@Component({
    selector: 'bloodrush-upcoming-games',
    templateUrl: './upcoming-games.component.html',
    styles: [`
        .card-content {
            height: 150px;
        }
        .see-more {
            cursor: pointer;
        }
    `]
})
export class UpcomingGamesComponent implements OnInit {
    @Input() season: any;
    teams: any = {};
    public gamesToday: any[] = [];

    constructor(private api: ApiService) { }

    ngOnInit(): void {
        let doWhile = true;
        for (let i = 0; i < 31; i++) {
            this.getGames(moment().add(i, 'days').toDate())
        }
        this.loadTeams();
    }

    getGames(date): void {
        let d = JSON.stringify(moment(date).format('YYYY/MM/DD'));
        this.api.run('get', `/games/allOnDate`, `&date=${d}`, {})
            .then(res => {
                let games = res.games;
                this.gamesToday = this.gamesToday.concat(games);
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
}
