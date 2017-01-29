import { Component, OnInit, Input, NgZone } from '@angular/core';

import { ApiService } from './../shared/api/api.service';

@Component({
    selector: 'bloodrush-team-players',
    templateUrl: './team-players.component.html'
})
export class TeamPlayersComponent implements OnInit {
    @Input() teamId: string;
    players: any;

    constructor(private api: ApiService, private zone: NgZone) { }

    ngOnInit(): void {
        if (!this.teamId) return;
        this.api.run('get', `/teams/${this.teamId}/players`, '', {})
            .subscribe(players => {
                this.players = players;
                this.zone.run(() => { });
            });
    }
}
