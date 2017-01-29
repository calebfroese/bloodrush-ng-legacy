import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { AccountService } from './../shared/account.service';
import { ApiService } from './../shared/api/api.service';

@Component({
    templateUrl: './team-detail.component.html'
})
export class TeamDetailComponent implements OnInit {
    team: any;
    players: any;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private api: ApiService,
        private acc: AccountService,
        private zone: NgZone
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            let teamId = params['teamId'];
            this.api.run('get', `/teams/${teamId}`, '', {})
                .switchMap(team => {
                    this.team = team;
                    return this.api.run('get', `/teams/${teamId}/players`, '', {})
                })
                .subscribe(players => {
                    this.players = players;
                    this.zone.run(() => { });
                })
        });
    }
}
