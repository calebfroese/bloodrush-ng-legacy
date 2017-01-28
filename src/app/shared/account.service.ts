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
    players: any;
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
                this.loadTeam(this.userId);
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
            .switchMap((response: any) => {
                this.teamId = response.data.teamId;
                // Verify the email
                return this.verifyTeam(user.email, this.teamId);
            })
            .switchMap(() => {
                // Load players
                return this.loadTeam(this.userId);
            });
    }

    verifyTeam(email: string, teamId: string): Observable<any> {
        console.log(email, teamId);
        return this.api.run('post', `/emails/sendActivation`, `&email=${email}&teamId=${teamId}`, {});
    }

    loadTeam(userId: string): Observable<any> {
        // Get the user
        return this.api.run('get', `/Users/${userId}`, '', {})
            .switchMap((user: any) => {
                return this.api.run('get', `/teams/${this.teamId}`, '', {});
                // this.user = user;
                // if (user.teamId) {
                //     this.teamId = user.teamId;
                //     localStorage.setItem('teamId', this.teamId);
                //     console.log('Team id found', this.teamId);
                //     // Get the team
                //     return this.api.run('get', `/teams/${this.teamId}`, '', {});
                // } else {
                //     console.warn('No team id found for this user!');
                //     return;
                // }
            }).switchMap((team: any) => {
                console.log('TEAM IS', team);
                this.team = team;
                return this.loadPlayers(this.teamId);
            });
    }

    loadPlayers(teamId: string): Observable<any> {
        // Get the players
        return this.api.run('get', `/teams/${teamId}/players`, '', {})
            .map(players => { this.players = players; console.log('PLAYERS SET'); });
    }
}
