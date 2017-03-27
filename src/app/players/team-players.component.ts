import { Component, OnInit, Input } from '@angular/core';

import { ApiService } from './../shared/api/api.service';

@Component({
    selector: 'bloodrush-team-players',
    templateUrl: './team-players.component.html',
    styles: [`
        .is-16x16 {
            width: 16px;
            height: 16px;
        }
    `]
})
export class TeamPlayersComponent implements OnInit {
    @Input() teamId: string;
    players: any;

    constructor(public api: ApiService) { }

    ngOnInit(): void {
        if (!this.teamId) return;
        this.api.run('get', `/teams/${this.teamId}/players`, '', {})
            .then(players => {
                this.players = players;
            });
    }
}
