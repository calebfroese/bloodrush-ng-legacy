import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { MongoService } from './../mongo/mongo.service';
import { Config } from './../shared/config';
import { environment } from './../../environments/environment';

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

    constructor(private mongo: MongoService, private http: Http) {
        // If localstorage account, fetch it
        if (localStorage.getItem('_id')) {
            // TODO better auth than guessing an _id.......
            this.setLoginVariables(localStorage.getItem('_id'));
        }
    }

    login(username: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${Config[environment.envName].apiUrl}/accounts/login`, { 'username': username, 'password': password }).subscribe(response => {
                reject(response);
            });
        });
    }

    logout(): Promise<any> {
        return new Promise((resolve, reject) => {
            localStorage.clear();
            this.loggedInAccount = {};
            resolve(true);
        });
    }

    signup(user: any, team: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${Config[environment.envName].apiUrl}/Users`, {
                'username': user.username,
                'email': user.email,
                'password': user.password
            }).subscribe(response => {
                console.log(response);
                resolve(response);
            });
        });
    }

    setLoginVariables(_id: string): Promise<any> {
        this.loggedInAccount._id = _id;
        // Fetch the rest of the account
        return this.mongo.run('users', 'oneById', { _id: _id })
            .then(user => {
                this.loggedInAccount = user;
                localStorage.setItem('_id', _id);
                // Load local team
                return this.mongo.run('teams', 'oneByOwner', { ownerId: _id });
            })
            .then(team => {
                this.loggedInAccount.team = team;
                return this.loadLeagues();
            })
            .catch(err => { debugger; });
    }

    loadLeagues(): Promise<any> {
        return this.mongo.run('leagues', 'allByTeam', { teamId: this.loggedInAccount.team._id })
            .then(leagues => {
                this.loggedInAccount.leagues = leagues;
            })
            .catch(err => { debugger; });
    }
}
