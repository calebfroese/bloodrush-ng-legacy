import { Injectable } from '@angular/core';

import { MongoService } from './../mongo/mongo.service';

@Injectable()
export class AccountService {
    loggedInAccount: any = {
        _id: null,
        team: {
            _id: null
        },
        leagues: {
            
        }
    };

    constructor(private mongo: MongoService) {
        // If localstorage account, fetch it
        if (localStorage.getItem('_id')) {
            // TODO better auth than guessing an _id.......
            this.setLoginVariables(localStorage.getItem('_id'));
        }
    }

    logout(): Promise<any> {
        return new Promise((resolve, reject) => {
            localStorage.clear();
            this.loggedInAccount = {};
            resolve(true);
        });
    }

    setLoginVariables(_id: string): void {
        this.loggedInAccount._id = _id;
        // Fetch the rest of the account
        this.mongo.run('users', 'oneById', { _id: _id })
            .then(user => {
                this.loggedInAccount = user;
                localStorage.setItem('_id', _id);
                // Load local team
                return this.mongo.run('teams', 'oneByOwner', { ownerId: _id });
            })
            .then(team => {
                this.loggedInAccount.team = team;
                this.loadLeagues();
            })

            .catch(err => { debugger; });
    }
    
    loadLeagues(): void {
        this.mongo.run('leagues', 'allByTeam', { teamId: this.loggedInAccount.team._id })
            .then(leagues => {
                this.loggedInAccount.leagues = leagues;
            })
            .catch(err => { debugger; });
    }
}
