import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

import { MongoService } from './../../mongo/mongo.service';

@Component({
    templateUrl: './game-detail.component.html'
})
export class GameDetailComponent implements OnInit {
    games: any = [];
    teams: any; // array of teams in the league sorted by points
    seasonNumber: number;
    gameId: number;
    isBye: boolean = false;
    nonByeTeam: number = 0; // index of the team that is not null

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private mongo: MongoService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            // Fetch the season
            this.seasonNumber = params['seasonNumber'];
            this.gameId = params['gameId'];
            this.mongo.fetchTeams().then(teamsArray => {
                this.teams = teamsArray;
                this.mongo.fetchSeasonByNumber(this.seasonNumber).then(season => {
                    this.games = season.games;
                    for (let x = 0; x < this.games.length; x++) {
                        // Fetch the name and stuff for the teams
                        for (let i = 0; i < 2; i++) {
                            if (!this.games[x][i]) {
                                if (this.gameId == x) { // make sure this is only == not ===
                                    this.isBye = true;
                                    this.calculateBye(x);
                                }
                            } else {
                                this.teams.forEach(team => {
                                    if (team._id === this.games[x][i]) {
                                        this.games[x][i] = team;
                                    }
                                });
                            }
                        }
                    };
                }).catch(err => {
                    debugger;
                });
            }).catch(() => {
                debugger;
            });
        });
    }

    calculateBye(x): void {
        if (!this.games[x][0]) {
            this.nonByeTeam = 1;
        } else {
            this.nonByeTeam = 0;
        }
    }
}
