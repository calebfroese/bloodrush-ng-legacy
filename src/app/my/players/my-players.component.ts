import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {PLAYER_SELL_DEFAULT, PLAYER_SELL_PRICE} from './../../../config/market.constants';
import {AccountService} from './../../shared/account.service';
import {ApiService} from './../../shared/api/api.service';
import {CustomValidators} from './../../shared/forms/custom-validators';

@Component({
  templateUrl: './my-players.component.html',
  styles: [`
        .is-16x16 {
            width: 16px;
            height: 16px;
        }
        .player-not-ok {
          color: red;
        }
        table .small {
            width:auto;
            text-align:right;
            white-space: nowrap
        }
        table  {
            border-collapse:collapse;
            border-spacing:0;
            width:100%;
        }
    `]
})
export class MyPlayersComponent implements OnInit {
  players: any[] = [];
  modalPlayer: any;
  modalSellForm: FormGroup;

  constructor(
      public acc: AccountService, public api: ApiService,
      public fb: FormBuilder) {
    this.modalSellForm = this.fb.group({
      askingPrice: new FormControl(
          '',
          [
            CustomValidators.required,
            CustomValidators.isRaw(
                'isInt',
                {min: PLAYER_SELL_PRICE.MIN, max: PLAYER_SELL_PRICE.MAX})
          ])
    });
  }

  ngOnInit(): void {
    // Load the players
    if (this.acc.team.playerIdsAtPos &&
        this.acc.team.playerIdsAtPos.length > 0) {
      for (let i = 0; i < this.acc.team.playerIdsAtPos.length; i++) {
        this.acc.players.forEach(player => {
          if (player.id === this.acc.team.playerIdsAtPos[i] &&
              this.players.indexOf(player) === -1) {
            this.players[i] = player;
          }
        });
      }
      this.acc.players.forEach(player => {
        if (this.players.indexOf(player) === -1) {
          this.players.push(player);
        }
      });
    } else {
      this.players = this.acc.players;
    }
    // Remove any nulls in the array
    this.players = this.clean(this.players);
  }

  moveTo(old_index, new_index) {
    if (!this.players[new_index]) return;

    if (new_index >= this.players.length) {
      let k = new_index - this.players.length;
      while ((k--) + 1) {
        this.players.push(undefined);
      }
    }
    this.players.splice(new_index, 0, this.players.splice(old_index, 1)[0]);
  }

  saveTeam(): void {
    // Saves the team to the current listing of players
    let playerIdsAtPos = [];
    for (let i = 0; i < this.players.length; i++) {
      playerIdsAtPos[i] = this.players[i].id;
    }
    this.api
        .run(
            'patch', `/teams/${this.acc.team.id}`, '',
            {playerIdsAtPos: playerIdsAtPos})
        .then(team => {
          alert('Player mapping saved.');
          console.log(team);
        });
  }

  openSellModal(player: any): void {
    // Opens the sell player modal
    this.modalPlayer = player;
  }

  placeOnMarket(val: any): void {
    // Puts the place on the market for the asking price
    if (!this.modalPlayer) return;
    if (this.modalPlayer.state === 'ok') {
      this.modalPlayer.state = 'market';
      this.modalPlayer.askingPrice = val.askingPrice;
      this.api
          .run('patch', `/players/${this.modalPlayer.id}`, '', this.modalPlayer)
          .then(savedPlayer => {
            this.resetForm();
            this.modalPlayer = null;
          })
          .catch(err => {
            this.resetForm();
            this.modalPlayer = null;
          });
    } else {
      alert('This player cannot be placed on the market');
    }
  }

  resetForm(): void {
    this.modalSellForm.patchValue({askingPrice: 0})
  }

  sellForDefault(): void {
    // Sells the player for the default price
    this.api
        .run(
            'put', `/players/sellForDefault`,
            `&playerId=${this.modalPlayer.id}&teamId=${this.acc.team.id}`, {})
        .then(() => {
          return this.acc.loadTeam();
        })
        .then(() => {
          this.resetForm();
          this.modalPlayer = null;
          this.ngOnInit();
        })
        .catch(err => {
          this.resetForm();
          this.modalPlayer = null;
          console.error(err);
          alert(err);
        });
  }

  clean(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == undefined || arr[i] == null) {
        arr.splice(i, 1);
        i--;
      }
    }
    return arr;
  }
}
