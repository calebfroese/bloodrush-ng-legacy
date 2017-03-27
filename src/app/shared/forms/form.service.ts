// Angular imports
import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {CustomValidators} from './custom-validators';
// Custom imports
import {LEAGUE, TEAM, USER, PLAYER} from './form.config';

@Injectable()
export class FormService {
  /**
   * Used to create forms to be used for markets and traders
   */

  // Account
  email = [
    '',
    Validators.compose(
        [Validators.required, CustomValidators.isRaw('isEmail')])
  ];
  password = [
    '',
    Validators.compose(
        [Validators.required, Validators.minLength(USER.PASSWORD.MIN)])
  ];
  username = [
    '', Validators.compose([
      Validators.required, Validators.minLength(USER.USERNAME.MIN),
      Validators.maxLength(USER.USERNAME.MAX)
    ])
  ];
  checkBox = ['', Validators.compose([])];
  // Team
  acronym = [
    '', Validators.compose([
      Validators.required, Validators.minLength(TEAM.ACRONYM.MIN),
      Validators.maxLength(TEAM.ACRONYM.MAX)
    ])
  ];
  teamName = [
    '', Validators.compose([
      Validators.required, Validators.minLength(TEAM.NAME.MIN),
      Validators.maxLength(TEAM.NAME.MAX)
    ])
  ];
  // League
  leagueName = [
    '', Validators.compose([
      Validators.required, Validators.minLength(LEAGUE.NAME.MIN),
      Validators.maxLength(LEAGUE.NAME.MAX)
    ])
  ];
  leaguePublic = [{value: true, disabled: false}];
  // Player
  playerFirst = [
    '', Validators.compose([
      Validators.required, Validators.minLength(PLAYER.FIRST.MIN),
      Validators.maxLength(PLAYER.FIRST.MAX)
    ])
  ];
  playerLast = [
    '', Validators.compose([
      Validators.required, Validators.minLength(PLAYER.LAST.MIN),
      Validators.maxLength(PLAYER.LAST.MAX)
    ])
  ];

  constructor(public fb: FormBuilder) {}

  signupForm(): FormGroup {
    return this.fb.group(
        {
          email: this.email,
          emailConf: this.email,
          password: this.password,
          passwordConf: this.password,
          username: this.username,
          acronym: this.acronym,
          teamName: this.teamName,
          mailUpdates: this.checkBox,
          mailNewsletter: this.checkBox
        },
        {
          validator: Validators.compose([
            CustomValidators.fieldsMatch('email', 'emailConf'),
            CustomValidators.fieldsMatch('password', 'passwordConf')
          ])
        });
  }

  leagueCreate(): FormGroup {
    return this.fb.group({name: this.leagueName, public: this.leaguePublic});
  }

  renamePlayerForm(): FormGroup {
    return this.fb.group({first: this.playerFirst, last: this.playerLast});
  }
}
