import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

import { MongoService } from './../../mongo/mongo.service';

@Component({
    templateUrl: './game-detail.component.html'
})
export class GameDetailComponent implements OnInit {
    isBye: boolean = false;
    nonByeTeam: string; // index of the team that is not null
    game: any;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private mongo: MongoService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            // Fetch the season
            let seasonNumber: number = +params['seasonNumber'];
            let gameId: number = +params['gameId'];
            this.mongo.fetchSeasonByNumber(seasonNumber).then(season => {
                if (season) {
                    if (season.games[gameId]) this.game = season.games[gameId];
                    // Load the teams
                    this.mongo.fetchTeamById(this.game.home).then(teamHome => {
                        this.game.home = teamHome;
                        
                        return this.mongo.fetchTeamById(this.game.away)
                    }).then(awayTeam => {
                        this.game.away = awayTeam;
                    }).catch(err => {
                        debugger;
                    })
                } else {
                    debugger;
                }
            }).catch(err => {
                debugger;
            });
        });
    }

    calculateBye(x): void {
        if (!this.game['home']) {
            this.nonByeTeam = 'home';
        } else {
            this.nonByeTeam = 'away';
        }
    }
}
