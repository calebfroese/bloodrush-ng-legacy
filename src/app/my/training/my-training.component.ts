import {Component} from '@angular/core';
import * as moment from 'moment';

import {AccountService} from '../../shared/account.service';
import {ApiService} from '../../shared/api/api.service';

import {TRAINING_COST_ADVANCED, TRAINING_COST_BASIC} from './../../../config/econ.constants';

@Component({
  templateUrl: './my-training.component.html',
  styles: [`
.button {float: right; margin-left: 5px;}
.is-4 {margin-top: 20px;}`]
})
export class MyTrainingComponent {
  players = this.acc.players;
  adv = TRAINING_COST_ADVANCED;
  basic = TRAINING_COST_BASIC;

  constructor(public acc: AccountService, public api: ApiService) {}

  basicTraining(player: any): void {
    player.stateEnds = moment().add(2, 'days').toDate();
    // Add stats
    player.atk += Math.round(Math.random() * 4);
    player.def += Math.round(Math.random() * 4);
    player.spd += Math.round(Math.random() * 4);
    this.trainPlayer(player, TRAINING_COST_BASIC);
  }

  advancedTraining(player: any): void {
    player.stateEnds = moment().add(7, 'days').toDate();
    // Add stats
    player.atk += Math.round(Math.random() * 17);
    player.def += Math.round(Math.random() * 17);
    player.spd += Math.round(Math.random() * 17);
    this.trainPlayer(player, TRAINING_COST_ADVANCED);
  }

  trainPlayer(player: any, cost: number): void {
    if (player.state !== 'ok') {
      alert('This player is not able to train');
      return;
    }
    player.state = 'training';
    this.api.run('get', `/teams/${player.teamId}`, '', {})
        .then(team => {
          if (team.money < cost) return Promise.reject('Not enough money');
          team.money -= cost;
          return this.api.run('patch', `/teams/${player.teamId}`, '', team)
        })
        .then(savedTeam => {
          this.acc.loadTeam();
          return this.api.run('patch', `/players/${player.id}`, '', player)
        })
        .catch(err => {
          console.error(err);
          alert(err);
        });
  }

  momentify(date: Date): string {
    return moment(date).fromNow();
  }
}
