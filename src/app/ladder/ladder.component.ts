import {Component, Input, OnInit} from '@angular/core';

import {environment} from './../../environments/environment';
import {ApiService} from './../shared/api/api.service';
import {Config} from './../shared/config';
import {ScoreService} from './../shared/score.service';

@Component({
  selector: 'bloodrush-ladder',
  templateUrl: './ladder.component.html',
  styles: [`
        .team { cursor: pointer; }
        .image { float: left; margin-right: 10px; }
    `]
})
export class LadderComponent implements OnInit {
  @Input() league: any;
  @Input() season: any;
  teams: any = [];
  config = Config;
  envName = environment.envName;

  constructor(public scoreService: ScoreService, public api: ApiService) {}

  ngOnInit(): void {
    // Load the teams
    this.loadTeams();
  }

  loadTeams(): void {
    this.season.teamIds.forEach(teamId => {
      let team = null;
      this.api.run('get', `/teams/${teamId}`, '', {})
          .then(t => {
            team = t;
            // Get the score
            console.log('about to query score');
            return this.api.run(
                'get', `/teams/score`,
                `&leagueId=${this.league.id}&seasonId=${this.season.id
                }&teamId=${teamId}`,
                {})
          })
          .then(response => {
            let teamScore = response.score;
            console.log('score', teamScore);
            let t = {
              team: team,
              score: teamScore,
              ratio: this.scoreService.calculateRatio(teamScore),
              pts: this.scoreService.calculatePoints(teamScore)
            };
            this.teams.push(t);
            this.sortByPoints();
            return;
          })
          .then(() => {});
    });
  }

  sortByPoints(): void {
    // Sorts the array by points
    let arr = this.teams;
    arr.sort((a: any, b: any) => {
      if (b.pts < a.pts) {
        return -1;
      } else if (b.pts > a.pts) {
        return 1;
      } else {
        // Sort by least ties
        if (b.score.t > a.score.t) {
          return -1;
        } else if (b.score.t < a.score.t) {
          return 1;
        } else {
          // Sort by least games played
          if (b.score.gp > a.score.gp) {
            return -1;
          } else if (b.score.gp < a.score.gp) {
            return 1;
          } else {
            return 0;
          }
        }
      }
    });
    this.teams = arr;
  }
}
