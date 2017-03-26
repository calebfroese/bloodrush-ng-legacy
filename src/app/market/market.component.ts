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
    this.getPlayers();
  }

  getPlayers() {
    this.players = [];
    this.api
        .run('get', `/players`, '&filter={"where": {"state": "market"}}', {})
        .then(playersForSale => {
          this.players = playersForSale;
        })
        .catch(err => {
          alert('Unable to fetch market players');
        });
    this.api
        .run(
            'get', `/teams/${this.acc.team.id}/players`,
            '&filter={"where": {"state": "market"}}', {})
        .then(playersForSale => {
          this.myPlayers = playersForSale;
        })
        .catch(err => {
          alert('Unable to fetch market players');
        });
  }

  viewPlayer(player: any, i: number): void {
    this.modalPlayer = player;
    this.modalPlayer.localIndex = i;
    // Fetch the team that is selling the player
  }

  cancelSale(player: any): void {
    // Puts the place on the market for the asking price
    if (!player) return;
    if (player.state === 'market') {
      player.state = 'ok';
      this.api.run('patch', `/players/${player.id}`, '', player)
          .then(savedPlayer => {
            this.getPlayers();
          })
          .catch(err => {
            alert('Unable to remove player from market');
          });
    } else {
      alert('This player is no longer on the market');
    }
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
