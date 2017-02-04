import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {PLAYER_SELL_DEFAULT, PLAYER_SELL_PRICE} from './../../../config/market.constants';
import {AccountService} from './../../shared/account.service';
import {ApiService} from './../../shared/api/api.service';
import {CustomValidators} from './../../shared/forms/custom-validators';

@Component({templateUrl: './my-players.component.html'})
export class MyPlayersComponent implements OnInit {
  players: any[] = [];
  modalPlayer: any;
  modalSellForm: FormGroup;

  constructor(
      private acc: AccountService, private api: ApiService,
      private fb: FormBuilder) {
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
      console.log('Loading from pos');
      console.log(this.acc.team.playerIdsAtPos);
      for (let i = 0; i < this.acc.team.playerIdsAtPos.length; i++) {
        this.acc.players.forEach(player => {
          if (player.id === this.acc.team.playerIdsAtPos[i]) {
            this.players[i] = player;
          }
        });
      }
    } else {
      console.log('Loading default');
      this.players = this.acc.players;
    }
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
    if (this.modalPlayer.state === 'ok') {
      this.modalPlayer.state = 'market';
      this.modalPlayer.askingPrice = val.askingPrice;
      this.api
          .run('patch', `/players/${this.modalPlayer.id}`, '', this.modalPlayer)
          .then(savedPlayer => {
            console.log(savedPlayer);
            this.resetForm();
            this.modalPlayer = null;
          })
          .catch(err => {
            this.resetForm();
            this.modalPlayer = null;
          });
    } else {
      console.error('You cannot market a player that is not playable!');
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
        .then(() => {return this.acc.loadTeam();})
        .then(() => {
          this.resetForm();
          this.modalPlayer = null;
          alert('Player sold');
        })
        .catch(err => {
          this.resetForm();
          this.modalPlayer = null;
          console.error(err);
          alert(err);
        });
  }
}
