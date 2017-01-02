import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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

    viewGame(gameId: number): void {
        console.log(gameId);
    }
}
