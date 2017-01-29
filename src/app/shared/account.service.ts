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
    seasonId: string;
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
                    console.log('UPDATING ZONE')
                    this.zone.run(() => { });
                })
        } else {
            console.log('Not logging in.', userId, sessionId)
        }
    }

    login(username: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.run('post', `/Users/login`, '', { username: username, password: password }).subscribe((response: any) => {
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
            this.zone.run(() => { });
            resolve(true);
        });
    }

    signup(user: any, team: any): Observable<any> {
        // Create a user
        return this.api.run('post', `/Users`, '', {
            username: user.username,
            email: user.email,
            password: user.password,
            teamId: this.teamId
        })
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
            }).switchMap(() => {
                return this.getMySeasonId(this.teamId);
            });
    }

    loadPlayers(teamId: string): Observable<any> {
        // Get the players
        return this.api.run('get', `/teams/${teamId}/players`, '', {})
            .switchMap(players => { this.players = players; return this.loadLeagues(this.teamId); })
    }

    loadLeagues(teamId: string): Observable<any> {
        // Get the leagues
        return this.api.run('get', `/leagues`, '', {})
            .map(leagues => { this.leagues = leagues; console.log('ALL leagues have been loged!'); return; });
    }

    getMySeasonId(teamId: string): Observable<any> {
        // Get the latest season for the league that the user is enroled in
        // TODO fetch the primary league's latest season
        if (!this.leagues || this.leagues.length < 1) return this.api.run('get', `/leagues`, '', {}); // do nothing with the data
        
        return this.api.run('get', `/leagues/${this.leagues[0].id}/seasons`, '', {})
            .map(seasons => {
                console.log(seasons);
                // Find the highest number season
                let highestSeason = 0;
                console.log('season id finding')
                seasons.forEach(s => {
                    if (s.number > highestSeason) {
                        highestSeason = s.number;
                        this.seasonId = s.id;
                        console.log('season id set')
                    }
                });
                return;
            });
    }
}
