import { Component } from '@angular/core';

@Component({
    templateUrl: './market.component.html'
})
export class MarketComponent {
    mockPlayers = [
        {
            first: 'Bob',
            last: 'Bobrovski',
            price: 62
        },
        {
            first: 'John',
            last: 'Spencer',
            price: 182
        },
        {
            first: 'Henry',
            last: 'Michaels',
            price: 53
        }
    ];
    players: any[] = this.mockPlayers;
}
