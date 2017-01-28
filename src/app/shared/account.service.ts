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
        console.log('logging in as', username, 'with', password);
        return new Promise((resolve, reject) => {
            this.http.post(`${Config[environment.envName].apiUrl}/Users/login`, { username: username, password: password }).map((res: any) => { return this.api.parseJSON(res._body) }).subscribe((response: any) => {
                // Set the session id
                this.api.sessionId = response.id;
                this.userId = response.userId;
                localStorage.setItem('userId', this.userId);
                this.loadAccount(this.userId);
                resolve(this.userId);
            });
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
        // Create a user
        return this.http.post(`${Config[environment.envName].apiUrl}/Users`, {
            username: user.username,
            email: user.email,
            password: user.password,
            teamId: this.teamId
        })
            .map((res: any) => { return this.api.parseJSON(res._body); })
            .switchMap((usr: any) => {
                return Observable.fromPromise(
                    this.login(user.username, user.password)
                );
            })
            .switchMap(() => {
                console.log('generating a team!!!!!!');
                // Create a user
                return this.api.run('post', `/teams/generate`, '', {
                    userId: this.userId,
                    name: team.name,
                    acronym: team.acronym,
                    access_token: this.api.sessionId
                });
            })
            .map((response: any) => {
                this.teamId = response.data.teamId;
                this.verifyTeam(user.email, this.teamId);
                return null;
            });
    }

    verifyTeam(email: string, teamId: string): void {
        console.log(email, teamId);
        let req = this.api.run('post', `/emails/sendActivation`, `&email=${email}&teamId=${teamId}`, {})
        req.subscribe(res => {
            debugger;
        });
    }

    loadAccount(userId: string): void {
        // Get the user
        this.http.get(`${Config[environment.envName].apiUrl}/Users/${userId}?${this.api.auth()}`).map((res: any) => { return this.api.parseJSON(res._body) }).subscribe((user: any) => {
            this.user = user;
            if (user.teamId) {
                this.teamId = user.teamId;
                localStorage.setItem('teamId', this.teamId);
                console.log('Team id found', this.teamId);
                // Get the team
                let sub = this.api.run('get', `/teams/${this.teamId}`, '', {});
                sub.subscribe((response: any) => {
                    console.log('Team is', response);
                    this.team = response;
                });
            } else {
                console.warn('No team id found for this user!');
            }
        });
    }
}
