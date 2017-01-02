import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MongoService } from './../mongo/mongo.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    teamWins: number = 5;
    teamLosses: number = 8;
    games: any = [];
    teams: any; // array of teams in the league sorted by points

    constructor(private mongo: MongoService, private router: Router) { }

    ngOnInit(): void {
        this.mongo.fetchTeams().then(teamsArray => {
            this.teams = teamsArray;
            this.games = teamsArray;
        }).catch(() => {
            debugger;
        });
    }

    viewGame(gameId: number): void {
        console.log(gameId);
    }

}
