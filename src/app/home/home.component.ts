import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MongoService } from './../mongo/mongo.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    season: any;
    teamWins: number = 5;
    teamLosses: number = 8;
    teams: any; // array of teams in the league sorted by points

    constructor(private mongo: MongoService, private router: Router) { }

    ngOnInit(): void {
        this.mongo.fetchSeasonByActive().then(season => {
            console.log(season)
            this.season = season;
            for (let i = 0; i < this.season.games.length; i++) {
                if (this.season.games[i]['round'] === parseInt(this.season.games[i]['round'], 10)) {
                    if (this.season.games[i]['home']) {
                        this.mongo.fetchTeamById(this.season.games[i]['home']).then(teamHome => {
                            // debugger;
                            this.season.games[i]['home'] = teamHome;
                        });
                    } else {
                        this.season.games[i]['home'] = { name: 'Bye' };
                    }
                    if (this.season.games[i]['away']) {
                        this.mongo.fetchTeamById(this.season.games[i]['away']).then(teamAway => {
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
        this.mongo.fetchTeams().then(teamsArray => {
            this.teams = teamsArray;
        }).catch(err => {
            debugger;
        });
    }

    viewGame(gameId: number): void {
        this.router.navigate(['/season/' + this.season.number + '/' + gameId]);
    }

}
