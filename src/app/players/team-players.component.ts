import { Component, OnInit, Input } from '@angular/core';

import { ApiService } from './../shared/api/api.service';

@Component({
    selector: 'bloodrush-team-players',
    templateUrl: './team-players.component.html'
})
export class TeamPlayersComponent implements OnInit {
    @Input() teamId: string;
    players: any;

    constructor(private api: ApiService) { }

    ngOnInit(): void {
        if (!this.teamId) return;
        this.api.run('get', `/teams/${this.teamId}/players`, '', {})
            .then(players => {
                this.players = players;
            });
    }
}
