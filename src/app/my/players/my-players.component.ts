import { Component } from '@angular/core';

import { MongoService } from './../../mongo/mongo.service';
import { AccountService } from './../../shared/account.service';

@Component({
    templateUrl: './my-players.component.html'
})
export class MyPlayersComponent {
    
    constructor(
        private acc: AccountService,
        private mongo: MongoService
    ) { }

    moveTo(old_index, new_index) {
        if (!this.acc.loggedInAccount.team.players[new_index]) return;

        if (new_index >= this.acc.loggedInAccount.team.players.length) {
            let k = new_index - this.acc.loggedInAccount.team.players.length;
            while ((k--) + 1) {
                this.acc.loggedInAccount.team.players.push(undefined);
            }
        }
        this.acc.loggedInAccount.team.players.splice(new_index, 0, this.acc.loggedInAccount.team.players.splice(old_index, 1)[0]);
    }

    saveTeam(): void {
        // Saves the team to the current orientation of players
        // TODO: Server-side protection of meddling
        this.mongo.run('teams', 'saveMyTeam', { team: this.acc.loggedInAccount.team })
            .then(res => {
                alert('Team saved successfully.');
            })
            .catch(err => {
                debugger;
            });
    }
}