import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from './../shared/account.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    season: any;
    teamWins: number = 0;
    teamLosses: number = 0;
    gamesPlayed: number = 0;
    teams: any; // array of teams in the league sorted by points
    myTeam: any;

    constructor(public router: Router, public acc: AccountService) { }

    ngOnInit(): void {
        // Fetch the 
        // this.mongo.run('get', '/seasons', {})
        //     .then(seasons => {
        //         let season = seasons[0];
        //         this.season = season;
        //         if (!this.season || !this.season.games) return;
        //         for (let i = 0; i < this.season.games.length; i++) {
        //             if (this.season.games[i]['round'] === parseInt(this.season.games[i]['round'], 10)) {
        //                 if (this.season.games[i]['home']) {
        //                     this.mongo.run('teams', 'oneById', { _id: this.season.games[i]['home'] }).then(teamHome => {
        //                         this.season.games[i]['home'] = teamHome;
        //                     });
        //                 } else {
        //                     this.season.games[i]['home'] = { name: 'Bye' };
        //                 }
        //                 if (this.season.games[i]['away']) {
        //                     this.mongo.run('teams', 'oneById', { _id: this.season.games[i]['away'] }).then(teamAway => {
        //                         this.season.games[i]['away'] = teamAway;

        //                     });
        //                 } else {
        //                     this.season.games[i]['away'] = { name: 'Bye' };
        //                 }
        //             } else {
        //                 // Playoffs, leave names as are
        //             }
        //         }
        //     }).catch(err => {
        //         debugger;
        //     });
        // this.mongo.run('get', '/teams', {}).then(teamsArray => {
        //     this.teams = teamsArray;
        // }).catch(err => {
        //     debugger;
        // });
    }

    viewGame(gameId: number): void {
        this.router.navigate(['/season/' + this.season.number + '/' + gameId]);
    }

    /**
     * Will fetch the win loss, ratio, gp, etc from the season object
     */
    getStats(team: any): void {
        for (let i = 0; i < this.season.games.length; i++) {
            if (this.season.games[i].home === team._id && this.season.games[i].data.gameAttr) {
                // Games plaeyd here
                this.gamesPlayed++;
            }
        }
    }
}
