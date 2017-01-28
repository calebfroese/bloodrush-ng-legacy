import { Injectable, NgZone } from '@angular/core';
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
    players: any = [];
    team: any;
    leagues: any = [];

    constructor(private api: ApiService, private http: Http, private zone: NgZone) {
        // If localstorage account, fetch it
        let sessionId = localStorage.getItem('sessionId');
        let userId = localStorage.getItem('userId');
        if (userId && sessionId) {
            // Can log in
            this.api.sessionId = sessionId;
            this.userId = userId;
            this.loadTeam()
                .subscribe(() => {
                    this.zone.run(() => {});
                })
        } else {
            console.log('Not logging in.', userId, sessionId)
        }
    }

    login(username: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${Config[environment.envName].apiUrl}/Users/login`, { username: username, password: password }).map((res: any) => { return this.api.parseJSON(res._body) }).subscribe((response: any) => {
                // Set the session id
                this.api.sessionId = response.id;
                localStorage.setItem('sessionId', this.api.sessionId);
                this.userId = response.userId;
                localStorage.setItem('userId', this.userId);
                resolve();
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
                // Create a user
                return this.api.run('post', `/teams/generate`, '', {
                    userId: this.userId,
                    name: team.name,
                    acronym: team.acronym,
                    access_token: this.api.sessionId
                });
            })
            .switchMap(cb => {
                // Load players
                return this.loadTeam();
            })
            .switchMap(() => {
                // Verify the email
                console.log('about to verify team')
                this.zone.run(() => { });
                return this.verifyTeam(user.email, this.teamId);
            });
    }

    verifyTeam(email: string, teamId: string): Observable<any> {
        return this.api.run('post', `/emails/sendActivation`, `&email=${email}&teamId=${teamId}`, {});
    }

    loadTeam(): Observable<any> {
        // Get the user
        return this.api.run('get', `/Users/${this.userId}`, '', {})
            .switchMap((user: any) => {
                this.user = user;
                console.log('user is', user);
                this.teamId = user.teamId;
                console.log('found teamid', this.teamId);
                return this.api.run('get', `/teams/${this.teamId}`, '', {});
            }).switchMap((team: any) => {
                this.team = team;
                console.log('setting team', team);
                return this.loadPlayers(this.teamId);
            });
    }

    loadPlayers(teamId: string): Observable<any> {
        // Get the players
        return this.api.run('get', `/teams/${teamId}/players`, '', {})
            .switchMap(players => { this.players = players; return this.loadLeagues(this.teamId); })
    }

    loadLeagues(teamId: string): Observable<any> {
        // Get the leagues
        return this.api.run('get', `/teams/${teamId}/leagues`, '', {})
            .map(leagues => { this.leagues = leagues; });
    }
}
