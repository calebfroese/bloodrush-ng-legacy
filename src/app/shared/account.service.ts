import 'rxjs/add/operator/map';

import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';

import {environment} from './../../environments/environment';
import {Config} from './../shared/config';
import {ApiService} from './api/api.service';

@Injectable()
export class AccountService {
  userId: string;
  teamId: string;
  seasonId: string;
  season: any;
  user: any;
  players: any = [];
  team: any;
  leagues: any = [];

  constructor(private api: ApiService, private http: Http) {
    this.checkCachedLogin();
  }

  checkCachedLogin(): Promise<boolean> {
    // If localstorage account, fetch it
    let sessionId = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    if (userId && sessionId) {
      // Can log in
      this.api.sessionId = sessionId;
      this.userId = userId;
      return this.loadTeam();
    } else {
      return Promise.reject('Not logged in');
    }
  }

  login(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api
          .run(
              'post', `/Users/login`, '',
              {username: username, password: password})
          .then((response: any) => {
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

  signup(user: any, team: any): Promise<any> {
    // Create a user
    return this.api
        .run('post', `/Users`, '', {
          username: user.username,
          email: user.email,
          password: user.password,
          teamId: this.teamId
        })
        .then((usr: any) => {return this.login(user.username, user.password)})
        .then(() => {
          // Create a user
          return this.api.run('post', `/teams/generate`, '', {
            userId: this.userId,
            name: team.name,
            acronym: team.acronym,
            access_token: this.api.sessionId
          });
        })
        .then(cb => {
          // Load players
          return this.loadTeam();
        })
        .then(() => {
          // Verify the email
          return this.verifyTeam(user.email, this.teamId);
        });
  }

  verifyTeam(email: string, teamId: string): Promise<any> {
    return this.api.run(
        'post', `/emails/sendActivation`, `&email=${email}&teamId=${teamId}`,
        {});
  }

  loadTeam(): Promise<any> {
    // Get the user
    return this.api.run('get', `/Users/${this.userId}`, '', {})
        .then((user: any) => {
          this.user = user;
          console.log('user is', user);
          this.teamId = user.teamId;
          console.log('found teamid', this.teamId);
          return this.api.run('get', `/teams/${this.teamId}`, '', {});
        })
        .then((team: any) => {
          this.team = team;
          console.log('setting team', team);
          return this.loadPlayers(this.teamId);
        })
        .then(() => {
          return this.getMySeasonId(this.teamId);
        });
  }

  loadPlayers(teamId: string): Promise<any> {
    // Get the players
    return this.api.run('get', `/teams/${teamId}/players`, '', {})
        .then(players => {
          this.players = players;
          return this.loadLeagues(this.teamId);
        })
  }

  loadLeagues(teamId: string): Promise<any> {
    // Get the leagues
    return this.api
        .run(
            'get', `/leagues`,
            `&filter={"include": {"chats": "owner"}, "where": {"teamIds": {"in": ["${teamId}"] }}}`, {})
        .then(leagues => {
          this.leagues = leagues;
          console.log('ALL leagues have been loged!', leagues);
        });
  }

  getMySeasonId(teamId: string): Promise<any> {
    // Get the latest season for the league that the user is enroled in
    // TODO fetch the primary league's latest season
    if (!this.leagues || this.leagues.length < 1)
      return this.api.run(
          'get', `/leagues`, '', {});  // do nothing with the data

    return this.api
        .run(
            'get', `/leagues/${this.leagues[0].id}/seasons`,
            `&filter={"where": {"teamIds": {"in": ["${teamId}"] }}}`, {})
        .then(seasons => {
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
          return this.api.run('get', `/seasons/${this.seasonId}`, '', {})
        })
        .then(season => {
          this.season = season;
          console.log('set season', season);
          return;
        });
  }

  calculateLevel(exp: number): number {
    return Math.floor(Math.sqrt(exp / 100));
  }

  calculateExp(level: number): number {
    return Math.floor(level * level * 100);
  }
}
