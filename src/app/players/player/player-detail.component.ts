import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {AccountService} from './../../shared/account.service';
import {ApiService} from './../../shared/api/api.service';

@Component({templateUrl: './player-detail.component.html'})
export class PlayerDetailComponent implements OnInit {
  player: any;

  constructor(
      private route: ActivatedRoute, private location: Location,
      private api: ApiService, private acc: AccountService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      let playerId = params['playerId'];
      this.api.run('get', `/players/${playerId}`, '', {}).then(player => {
        this.player = player;
      })
    });
  }
}
