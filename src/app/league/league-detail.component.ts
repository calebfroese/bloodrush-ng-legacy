import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { MongoService } from './../mongo/mongo.service';

@Component({
    templateUrl: './league-detail.component.html'
})
export class LeagueDetailComponent implements OnInit {
    leagueId: string;
    league: any;

    constructor(private mongo: MongoService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        // Load the league specified
        this.route.params.forEach((params: Params) => {
            this.leagueId = params['leagueId'];
            this.mongo.run('leagues', 'oneById', { _id: this.leagueId })
                .then(league => {
                    this.league = league;
                })
                .catch(err => {
                    debugger;
                });
        });
    }
}
