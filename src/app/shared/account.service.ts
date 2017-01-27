import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

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
            this.http.post(`${Config[environment.envName].apiUrl}/Users/login`, { username: username, password: password }).subscribe((response: any) => {
                // Set the session id
                this.api.sessionId = JSON.parse(response._body).id;
                this.userId = JSON.parse(response._body).userId;
                resolve(this.userId);
            });
        }).then(userId => {
            return new Promise((resolve, reject) => {
                // Get the user
                this.http.get(`${Config[environment.envName].apiUrl}/Users/${userId}${this.api.auth()}`).subscribe((response: any) => {
                    this.user = JSON.parse(response._body);
                    if (response._body.teamId) this.teamId = JSON.parse(response._body.teamId);
                    resolve();
                });
            });
        }).then(() => {
            if (this.teamId) {
                return new Promise((resolve, reject) => {
                    // Get the team
                    this.http.get(`${Config[environment.envName].apiUrl}/teams/${this.teamId}${this.api.auth()}`).subscribe((response: any) => {
                        this.team = JSON.parse(response._body);
                        console.log('team is', this.team);
                        resolve();
                    });
                });
            }
        });
    }

    logout(): Promise<any> {
        return new Promise((resolve, reject) => {
            localStorage.clear();
            resolve(true);
        });
    }

    signup(user: any, team: any): Promise<any> {
        return new Promise((resolve, reject) => {
            // Create a team
            this.http.post(`${Config[environment.envName].apiUrl}/teams`, {
                name: team.name,
                acronym: team.acronym
            }).subscribe(() => {
                // Create a user
                this.http.post(`${Config[environment.envName].apiUrl}/Users`, {
                    username: user.username,
                    email: user.email,
                    password: user.password
                }).subscribe(response => {
                    resolve(response);
                });
            });
        });
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
