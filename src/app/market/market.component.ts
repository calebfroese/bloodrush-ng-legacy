import {Component, OnInit} from '@angular/core';

import {AccountService} from './../shared/account.service';
import {ApiService} from './../shared/api/api.service';

@Component({templateUrl: './market.component.html'})
export class MarketComponent implements OnInit {
  players: any[];
  myPlayers: any[];
  modalPlayer: any;  // the player being viewed in a modal

  constructor(private api: ApiService, private acc: AccountService) {}

  ngOnInit(): void {
    // Load the players
    this.api
        .run('get', `/players`, '&filter={"where": {"state": "market"}}', {})
        .then(playersForSale => {
          this.players = playersForSale;
        })
        .catch(err => {
          debugger;
        });
    this.api
        .run(
            'get', `/teams/${this.acc.team.id}/players`,
            '&filter={"where": {"state": "market"}}', {})
        .then(playersForSale => {
          this.myPlayers = playersForSale;
        })
        .catch(err => {
          debugger;
        });
  }

  viewPlayer(player: any, i: number): void {
    this.modalPlayer = player;
    this.modalPlayer.localIndex = i;
    // Fetch the team that is selling the player
  }

  purchasePlayer(player: any): void {
    // Purchases a player
    this.api
        .run(
            'patch', `/players/purchase`,
            `&playerId=${player.id}&teamId=${this.acc.team.id}`, {})
        .then(() => {
          return this.acc.loadTeam();
        })
        .then(() => {
          alert('Successfully purchased ' + player.first + ' ' + player.last);
          this.modalPlayer = undefined;
          this.ngOnInit();
        })
        .catch(err => {
          alert(err);
          console.error(err);
        })
  }
}
