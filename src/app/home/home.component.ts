import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MongoService } from './../mongo/mongo.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    seasonNumber: number = 1; // 1 default for testing
    teamWins: number = 5;
    teamLosses: number = 8;
    games: any = [];
    teams: any; // array of teams in the league sorted by points

    constructor(private mongo: MongoService, private router: Router) { }

    ngOnInit(): void {
        this.mongo.fetchTeams().then(teamsArray => {
            this.teams = teamsArray;
            this.mongo.fetchSeasonByNumber(this.seasonNumber).then(season => {
                this.games = season.games;
                for (let x = 0; x < this.games.length; x++) {
                    // Fetch the name and stuff for the teams
                    for (let i = 0; i < 2; i++) {
                        if (!this.games[x][i]) {
                            this.games[x][i] = { 'name': 'Bye' };
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
    }

    viewGame(gameId: number): void {
        this.router.navigate(['/season/' + this.seasonNumber + '/' + gameId]);
    }

}
