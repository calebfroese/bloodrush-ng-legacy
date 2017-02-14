import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

import {MIN_LEAGUE_CREATE_LVL} from './../../../config/econ.constants';
import {AccountService} from './../../shared/account.service';
import {ApiService} from './../../shared/api/api.service';
import {FormService} from './../../shared/forms/form.service';

@Component({templateUrl: './league-create.component.html'})
export class LeagueCreateComponent {
  form: FormGroup
  newLeague = {public: true, name: ''};

  constructor(
      private api: ApiService, private acc: AccountService,
      private router: Router, private formService: FormService) {
    this.form = this.formService.leagueCreate();
    if (!acc.team ||
        acc.calculateLevel(acc.team.experience) >= MIN_LEAGUE_CREATE_LVL) {
      alert(
          `Not high enough level to create a league. You must be at least level ${MIN_LEAGUE_CREATE_LVL
          } to create a league.`);
      this.router.navigate(['/leagues']);
    }
  }

  /**
   * Creates a league with you as the owner
   */
  create(val: any): void {
    if (!this.acc.team.init) {
      alert(
          'You cannot create a team until you have set your team colors and style.');
      this.router.navigate(['/home/team/team']);
      return;
    }
    this.api
        .run('patch', `/leagues`, '', {
          name: val.name,
          public: val.public,
          ownerId: this.acc.teamId,
        })
        .then(() => {
          alert('League added');
          this.acc.loadLeagues(this.acc.teamId);  // refresh the leagues
          this.router.navigate(['/leagues']);
        });
  }
}
