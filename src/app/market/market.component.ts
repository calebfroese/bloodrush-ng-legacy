import { Component, OnInit } from '@angular/core';

import { ApiService } from './../shared/api/api.service';
import { AccountService } from './../shared/account.service';

@Component({
    templateUrl: './market.component.html'
})
export class MarketComponent implements OnInit {
    players: any[];
    myPlayers: any[];
    modalPlayer: any; // the player being viewed in a modal

    constructor(private api: ApiService, private acc: AccountService) { }

    ngOnInit(): void {
        // Load the players
        this.api.run('get', `/players`, '&filter={"where": {"state": "market"}}', {})
            .then(playersForSale => {
                this.players = playersForSale;
            }).catch(err => {
                debugger;
            });
        this.api.run('get', `/teams/${this.acc.team.id}/players`, '&filter={"where": {"state": "market"}}', {})
            .then(playersForSale => {
                this.myPlayers = playersForSale;
            }).catch(err => {
                debugger;
            });
    }

    viewPlayer(player) {
        this.modalPlayer = player;
        // Fetch the team that is selling the player
    }
}
