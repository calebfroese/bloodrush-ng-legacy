import { Component } from '@angular/core';

import { ApiService } from './../../shared/api/api.service';
import { AccountService } from './../../shared/account.service';

@Component({
    templateUrl: './my-players.component.html'
})
export class MyPlayersComponent {

    constructor(
        private acc: AccountService,
        private api: ApiService
    ) {
        this.players = this.acc.players;
    }

    players: any[] = [];

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
        // TODO: Server-side protection of meddling
        console.error('save team!');
        debugger;
        // this.mongo.run('teams', 'saveMyTeam', { team: this.acc.team })
        //     .then(res => {
        //         alert('Team saved successfully.');
        //     })
        //     .catch(err => {
        //         debugger;
        //     });
    }
}