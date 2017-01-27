import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';

import { ApiService } from './api/api.service';
import { Config } from './../shared/config';
import { environment } from './../../environments/environment';

@Injectable()
export class AccountService {
    userId: string;
    teamId: string;
    user: any;
    team: any;

    constructor(private api: ApiService, private http: Http) {
        // If localstorage account, fetch it
        // if (localStorage.getItem('_id')) {
        //     // TODO better auth than guessing an _id.......
        //     // this.setLoginVariables(localStorage.getItem('_id'));
        // }
    }

    login(username: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${Config[environment.envName].apiUrl}/Users/login`, { username: username, password: password }).map((res: any) => { return this.api.parseJSON(res._body) }).subscribe((response: any) => {
                // Set the session id
                this.api.sessionId = response.id;
                this.userId = response.userId;
                localStorage.setItem('userId', this.userId);
                resolve(this.userId);
            });
        }).then(userId => {
            return new Promise((resolve, reject) => {
                // Get the user
                this.http.get(`${Config[environment.envName].apiUrl}/Users/${userId}${this.api.auth()}`).map((res: any) => { return this.api.parseJSON(res._body) }).subscribe((user: any) => {
                    this.user = user;
                    if (user.teamId) {
                        this.teamId = user.teamId;
                        localStorage.setItem('teamId', this.teamId);
                        console.log('Team id found', this.teamId);
                    } else {
                        console.warn('No team id found for this user!');
                    }
                    resolve();
                });
            });
        }).then(() => {
            if (this.teamId) {
                let sub = this.api.run('get', `/teams/${this.teamId}`, {});
                sub.subscribe((response: any) => {
                    console.log('Team is', response);
                    this.team = response;
                });
            }
        });
    }

    logout(): Promise<any> {
        return new Promise((resolve, reject) => {
            localStorage.clear();
            this.team = this.user = this.userId = this.teamId = null;
            resolve(true);
        });
    }

    signup(user: any, team: any): Observable<any> {
        // Create a team
        return this.http.post(`${Config[environment.envName].apiUrl}/teams`, {
            name: team.name,
            acronym: team.acronym
        }).switchMap(() => {
            // Create a user
            return this.http.post(`${Config[environment.envName].apiUrl}/Users`, {
                username: user.username,
                email: user.email,
                password: user.password
            });
        }).map(() => { return null; });
    }

    // setLoginVariables(_id: string): Promise<any> {
    //     this.loggedInAccount._id = _id;
    //     // Fetch the rest of the account
    //     return this.mongo.run('users', 'oneById', { _id: _id })
    //         .then(user => {
    //             this.loggedInAccount = user;
    //             localStorage.setItem('_id', _id);
    //             // Load local team
    //             return this.mongo.run('teams', 'oneByOwner', { ownerId: _id });
    //         })
    //         .then(team => {
    //             this.loggedInAccount.team = team;
    //             return this.loadLeagues();
    //         })
    //         .catch(err => { debugger; });
    // }

    // loadLeagues(): Promise<any> {
    //     return this.mongo.run('leagues', 'allByTeam', { teamId: this.loggedInAccount.team._id })
    //         .then(leagues => {
    //             this.loggedInAccount.leagues = leagues;
    //         })
    //         .catch(err => { debugger; });
    // }
}
