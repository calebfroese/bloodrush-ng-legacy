import { Component, Input, OnInit } from '@angular/core';

import { ApiService } from './../shared/api/api.service';
import * as moment from 'moment';

@Component({
    selector: 'bloodrush-upcoming-games',
    templateUrl: './upcoming-games.component.html'
})
export class UpcomingGamesComponent implements OnInit {
    @Input() season: any;
    public gamesToday: any[] = [];

    constructor(private api: ApiService) { }

    ngOnInit(): void {
        let doWhile = true;
        for (let i = 0; i < 31; i++) {
            this.getGames(moment().add(i, 'days').toDate())
        }
    }

    getGames(date): void {
        let d = JSON.stringify(moment(date).format('YYYY/MM/DD'));
        this.api.run('get', `/games/allOnDate`, `&date=${d}`, {})
            .then(res => {
                let games = res.games;
                this.gamesToday = this.gamesToday.concat(games);
            });
    }
}
