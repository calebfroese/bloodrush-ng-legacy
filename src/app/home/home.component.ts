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
            'team': 'Burnside Blazers',
            'venue': 'MTS Center'
        },
        {
            'team': 'Banksia Vikings',
            'venue': 'All-Star Arena'
        },
        {
            'team': 'Golden Grove Chasers',
            'venue': 'GZ'
        },
        {
            'team': 'Redwood Park Rangers',
            'venue': 'Gumroad Stadium'
        }
    ];
}
