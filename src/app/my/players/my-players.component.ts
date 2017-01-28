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
    ) { }

    moveTo(old_index, new_index) {
        if (!this.acc.players[new_index]) return;

        if (new_index >= this.acc.players.length) {
            let k = new_index - this.acc.players.length;
            while ((k--) + 1) {
                this.acc.players.push(undefined);
            }
        }
        this.acc.players.splice(new_index, 0, this.acc.players.splice(old_index, 1)[0]);
    }

    saveTeam(): void {
        // Saves the team to the current listing of players
        // TODO: Server-side protection of meddling
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