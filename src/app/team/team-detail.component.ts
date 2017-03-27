import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Config } from './../shared/config';
import { environment } from './../../environments/environment';
import { AccountService } from './../shared/account.service';
import { ApiService } from './../shared/api/api.service';

@Component({
    templateUrl: './team-detail.component.html',
    styles: [`
        .team-icon {
            width: 100px;
            height: 100px;
        }
    `]
})
export class TeamDetailComponent implements OnInit {
    team: any;
    players: any;
    config = Config;
    envName = environment.envName;

    constructor(
        public route: ActivatedRoute,
        public location: Location,
        public api: ApiService,
        public acc: AccountService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            let teamId = params['teamId'];
            this.api.run('get', `/teams/${teamId}`, '', {})
                .then(team => {
                    this.team = team;
                    return this.api.run('get', `/teams/${teamId}/players`, '', {})
                })
                .then(players => {
                    this.players = players;
                });
        });
    }
}
