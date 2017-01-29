import { Component, OnInit, Input } from '@angular/core';


@Component({
    selector: 'bloodrush-team-players',
    templateUrl: './team-players.component.html'
})
export class TeamPlayersComponent implements OnInit {
    @Input() teamId: string;
    team: any;

    constructor() { }

    ngOnInit(): void {
        // if (!this.teamId) return;
        // this.mongo.run('teams', 'oneById', {_id: this.teamId})
        // .then(team => {
        //     this.team = team;
        // })
        // .catch(err => {
        //     debugger;
        // })
    }
}
