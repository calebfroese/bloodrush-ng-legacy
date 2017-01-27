import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MongoService } from './../mongo/mongo.service';
import { AccountService } from './../shared/account.service';

@Component({
    templateUrl: './league.component.html'
})
export class LeagueComponent implements OnInit {
    allLeagues: any = [];
    enrolledLeagues: any = [];

    constructor(private mongo: MongoService, private acc: AccountService, private router: Router) { }

    ngOnInit(): void {
        if (this.acc.team.leagues) {
            this.enrolledLeagues = this.acc.team.leagues;
            this.getOwnerName(this.enrolledLeagues, 'enrolledLeagues');
        } else {
            console.log('No acconts for leagues! on on')
        }
        this.mongo.run('leagues', 'allPublic', {})
            .then(allLeagues => {
                this.getOwnerName(allLeagues, 'allLeagues');
                this.allLeagues = allLeagues;
            })
            .catch(err => {
                debugger;
            });
    }

    view(id: string): void {
        this.router.navigate([`/leagues/${id}`]);
    }

    getOwnerName(leagueArr: any[], ref: string): void {
        for(let i = 0; i < leagueArr.length; i++) {
            this.mongo.run('teams', 'oneById', { _id: leagueArr[i].ownerId })
                .then(team => {
                    this[ref][i].ownerName = team.name;
                });
        }
    }
}
