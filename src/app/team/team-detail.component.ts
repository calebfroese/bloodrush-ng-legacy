import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { MongoService } from './../mongo/mongo.service';

@Component({
    templateUrl: './team-detail.component.html'
})
export class TeamDetailComponent implements OnInit {
    team: any;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private mongo: MongoService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            let teamId = params['teamId'];
            this.mongo.run('teams', 'oneById', { _id: teamId }).then(team => {
                this.team = team;
            });
        });
    }
}
