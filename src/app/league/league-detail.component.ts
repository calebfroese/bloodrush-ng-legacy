import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {environment} from './../../environments/environment';
import {AccountService} from './../shared/account.service';
import {ApiService} from './../shared/api/api.service';
import {Config} from './../shared/config';

@Component({templateUrl: './league-detail.component.html'})
export class LeagueDetailComponent implements OnInit {
  leagueId: string;
  league: any;
  teams: any[] = [];            // teams belonging to the league
  requestTeams: string[] = [];  // teams requesting to join the league
  seasons: any[] = [];

  constructor(
      private api: ApiService, private route: ActivatedRoute,
      private acc: AccountService, private router: Router) {}

  ngOnInit(): void {
    // Load the league specified
    this.route.params.forEach((params: Params) => {
      this.leagueId = params['leagueId'];
      if (this.leagueId) this.loadLeague();
    });
  }

  loadLeague(): Promise<any> {
    return this.fetchLeague()
        .then(() => {
          return this.fetchSeasons();
        })
        .then(() => {
          this.fetchTeams();
        });
  }

  fetchLeague(): Promise<any> {
    return this.api.run('get', `/leagues/${this.leagueId}`, '', {})
        .then(league => {
          this.league = league;
        });
  }

  fetchSeasons(): Promise<any> {
    return this.api.run('get', `/leagues/${this.leagueId}/seasons`, '', {})
        .then(seasons => {
          this.seasons = seasons;
        });
  }

  fetchTeams(): void {
    this.teams = [];
    this.league.teamIds.forEach(teamId => {
      return this.api.run('get', `/teams/${teamId}`, '', {}).then(team => {
        this.teams.push(team);
      });
    });
    this.requestTeams = [];
    if (this.league.requestTeamIds)
      this.league.requestTeamIds.forEach(teamId => {
        return this.api.run('get', `/teams/${teamId}`, '', {}).then(team => {
          this.requestTeams.push(team);
        });
      });
  }

  /**
   * Requests enrollment for a user in a league
   */
  enroll(): void {
    // Make sure the user cannot enrol if they have not yet created team colours
    if (!this.acc.team.init) {
      alert(
          'You cannot enrol in a league until you have set your team colors and logo.');
      this.router.navigate(['/home/team/team']);
      return;
    }
    this.api.run('get', `/leagues/${this.leagueId}`, '', {}).then(league => {
      if (league.teamIds.indexOf(this.acc.team.id) !== -1) return;
      if (league.requestTeamIds.indexOf(this.acc.team.id) !== -1) return;
      console.log('did not return');
      league.requestTeamIds.push(this.acc.team.id);
      this.api.run('patch', `/leagues/${this.leagueId}`, '', league)
          .then(() => {
            this.loadLeague();
          });
    });
  }

  /**
   * Cancels a join request
   */
  unenroll(): void {
    this.api.run('get', `/leagues/${this.leagueId}`, '', {}).then(league => {
      var index = league.requestTeamIds.indexOf(this.acc.team.id);
      if (index > -1) {
        league.requestTeamIds.splice(index, 1);
      }
      this.api.run('patch', `/leagues/${this.leagueId}`, '', league)
          .then(() => {
            this.loadLeague();
          });
    });
  }

  generateSeason(): void {
    if (!this.leagueId) return;
    this.api.run('post', `/leagues/generateSeason`, `&id=${this.leagueId}`, {})
        .then(res => {
          this.loadLeague();
        });
  }

  approveRequest(teamId: string): void {
    this.api.run('get', `/leagues/${this.leagueId}`, '', {}).then(league => {
      var index = league.requestTeamIds.indexOf(teamId);
      if (index > -1) {
        league.requestTeamIds.splice(index, 1);
      }
      league.teamIds.push(teamId);
      this.api.run('patch', `/leagues/${this.leagueId}`, '', league)
          .then(() => {
            this.loadLeague();
          });
    });
  }

  denyRequest(teamId: string): void {
    this.api.run('get', `/leagues/${this.leagueId}`, '', {}).then(league => {
      var index = league.requestTeamIds.indexOf(teamId);
      if (index > -1) {
        league.requestTeamIds.splice(index, 1);
      }
      this.api.run('patch', `/leagues/${this.leagueId}`, '', league)
          .then(() => {
            this.loadLeague();
          });
    });
  }
}
