import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Params} from '@angular/router';

import {PLAYER_RENAME_COST} from './../../../config/econ.constants';
import {AccountService} from './../../shared/account.service';
import {ApiService} from './../../shared/api/api.service';
import {FormService} from './../../shared/forms/form.service';

@Component({templateUrl: './player-detail.component.html'})
export class PlayerDetailComponent implements OnInit {
  player: any;
  form: FormGroup;
  renameCost = PLAYER_RENAME_COST;

  constructor(
      private route: ActivatedRoute, private location: Location,
      private api: ApiService, private acc: AccountService,
      private formService: FormService) {
    this.form = this.formService.renamePlayerForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      let playerId = params['playerId'];
      this.api.run('get', `/players/${playerId}`, '', {}).then(player => {
        this.player = player;
      })
    });
  }

  // renamePlayer(val: any): void {
  //   this.api.run('get', `/teams/${this.acc.team.id}`, '', {})
  //       .then(team => {
  //         if (team.money < PLAYER_RENAME_COST) {
  //           return Promise.reject('Not enough money');
  //         }
  //         if (team.id !== this.acc.team.id) {
  //           return Promise.reject('This player is not yours!');
  //         }
  //         team.money -= PLAYER_RENAME_COST;
  //         return this.api.run('patch', `/teams/${this.acc.team.id}`, '', team)
  //       })
  //       .then(() => {
  //         this.player.first = val.first;
  //         this.player.last = val.last;
  //         return this.api.run(
  //             'patch', `/players/${this.player.id}`, '', this.player)
  //       })
  //       .then(() => {
  //         return this.acc.loadTeam();
  //       })
  //       .catch(err => {
  //         alert(err);
  //         console.error(err);
  //       })
  // }
}
