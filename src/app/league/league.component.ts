import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './../shared/api/api.service';
import { AccountService } from './../shared/account.service';

@Component({
    templateUrl: './league.component.html'
})
export class LeagueComponent implements OnInit {
    allLeagues: any = [];
    enrolledLeagues: any = [];

    constructor(private api: ApiService, private acc: AccountService, private router: Router) { }

    ngOnInit(): void {
        if (this.acc.leagues) {
            this.enrolledLeagues = this.acc.leagues;
            this.getOwnerName(this.enrolledLeagues, 'enrolledLeagues');
        } else {
            console.log('No acconts for leagues! on on')
        }
        this.api.run('get', '/leagues', '', {})
            .subscribe(allLeagues => {
                console.log(allLeagues);
                // this.getOwnerName(allLeagues, 'allLeagues');
                this.allLeagues = allLeagues;
            });
    }

    view(id: string): void {
        this.router.navigate([`/leagues/${id}`]);
    }

    getOwnerName(leagueArr: any[], ref: string): void {
        for (let i = 0; i < leagueArr.length; i++) {
            if (leagueArr[i].ownerId) {
                this.api.run('get', `/teams/${leagueArr[i].ownerId}`, '', {})
                    .subscribe(team => {
                        this[ref][i].ownerName = team.name;
                    });
            }
        }
    }
}
