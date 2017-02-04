import { Component, OnInit } from '@angular/core';

import { ApiService } from './../../shared/api/api.service';
import { AccountService } from './../../shared/account.service';

@Component({
    templateUrl: './my-players.component.html'
})
export class MyPlayersComponent implements OnInit {
    players: any[] = [];
    modalPlayer: any;

    constructor(
        private acc: AccountService,
        private api: ApiService
    ) { }

    ngOnInit(): void {
        // Load the players
        if (this.acc.team.playerIdsAtPos && this.acc.team.playerIdsAtPos.length > 0) {
            console.log('Loading from pos');
            console.log(this.acc.team.playerIdsAtPos);
            for (let i = 0; i < this.acc.team.playerIdsAtPos.length; i++) {
                this.acc.players.forEach(player => {
                    if (player.id === this.acc.team.playerIdsAtPos[i]) {
                        this.players[i] = player;
                    }
                });
            }
        } else {
            console.log('Loading default');
            this.players = this.acc.players;
        }
    }

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
        let playerIdsAtPos = [];
        for (let i = 0; i < this.players.length; i++) {
            playerIdsAtPos[i] = this.players[i].id;
        }
        this.api.run('patch', `/teams/${this.acc.team.id}`, '', {
            playerIdsAtPos: playerIdsAtPos
        })
            .then(team => {
                alert('Player mapping saved.');
                console.log(team);
            });
    }

    openSellModal(player: any): void {
        // Opens the sell player modal
        this.modalPlayer = player;
    }
}