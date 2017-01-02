import { Component, OnInit } from '@angular/core';

import { MongoService } from './../mongo/mongo.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    teamWins: number = 5;
    teamLosses: number = 8;
    games: any = [
        {
            'id': '2319r7bhw9q87h92',
            'team': 'Burnside Blazers',
            'venue': 'MTS Center',
            'time': Date()
        },
        {
            'id': '2319r7bhw9q87h92',
            'team': 'Banksia Vikings',
            'venue': 'All-Star Arena',
            'time': Date()
        },
        {
            'id': '2319r7bhw9q87h92',
            'team': 'Golden Grove McChasers',
            'venue': 'GZ',
            'time': Date()
        },
        {
            'id': '2319r7bhw9q87h92',
            'team': 'Redwood Park Rangers',
            'venue': 'Gumroad Stadium',
            'time': Date()
        }
    ];
    teams: any; // array of teams in the league sorted by points

    constructor(private mongo: MongoService) { }

    ngOnInit(): void {
        this.mongo.fetchTeams().then(teamsArray => {
            this.teams = teamsArray;
        }).catch(() => {
            debugger;
        });
    }

    viewGame(gameId: number): void {
        console.log(gameId);
    }

}
