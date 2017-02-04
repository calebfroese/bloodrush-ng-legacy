import { Component } from '@angular/core';

@Component({
    templateUrl: './market.component.html'
})
export class MarketComponent {
    mockPlayers = [
        {
            first: 'Bob',
            last: 'Bobrovski',
            price: 62,
            atk: 52,
            def: 61,
            spd: 80,
            kg: 90,
            rec: 20,
            state: 'market'
        },
        {
            first: 'John',
            last: 'Spencer',
            price: 182,
            atk: 52,
            def: 61,
            spd: 80,
            kg: 90,
            rec: 20,
            state: 'market'
        },
        {
            first: 'Henry',
            last: 'Michaels',
            price: 53,
            atk: 52,
            def: 61,
            spd: 80,
            kg: 90,
            rec: 20,
            state: 'market'
        }
    ];
    players: any[] = this.mockPlayers;
    modalPlayer: any; // the player being viewed in a modal

    viewPlayer(player) {
        this.modalPlayer = player;
        // Fetch the team that is selling the player
    }
}
