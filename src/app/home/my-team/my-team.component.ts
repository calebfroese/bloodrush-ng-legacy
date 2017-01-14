import { Component, OnInit } from '@angular/core';

import { MongoService } from './../../mongo/mongo.service';
import { AccountService } from './../../shared/account.service';

@Component({
    templateUrl: './my-team.component.html'
})
export class MyTeamComponent implements OnInit {
    team: any;

    constructor(
        private acc: AccountService,
        private mongo: MongoService
    ) { }

    ngOnInit(): void {
        // Upon page init, load the team data
        this.loadTeam();
    }

    loadTeam(): void {
        this.mongo.run('teams', 'oneByOwner', { ownerId: this.acc.loggedInAccount._id })
            .then(team => {
                this.team = team;
            })
            .catch(err => {
                debugger
            });
    }

    moveUp(index): void {
        // Moves a player up a space
        var temp = this.team.players[index];
        this.team.players[index]
    }

    moveDown(index): void {
        // Moves a player down a space
    }

    moveTo(old_index, new_index) {
        if (new_index >= this.team.players.length) {
            let k = new_index - this.team.players.length;
            while ((k--) + 1) {
                this.team.players.push(undefined);
            }
        }
        this.team.players.splice(new_index, 0, this.team.players.splice(old_index, 1)[0]);
        // return this.team.players; // for testing purposes
    };
}
