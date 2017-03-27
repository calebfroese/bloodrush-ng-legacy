import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

import {environment} from './../../../environments/environment';
import {AccountService} from './../../shared/account.service';
import {ApiService} from './../../shared/api/api.service';
import {CustomValidators} from './../../shared/forms/custom-validators';
import {FormService} from './../../shared/forms/form.service';

@Component({templateUrl: './signup.component.html'})
export class SignupComponent {
  form: FormGroup;
  user: any = {username: '', email: '', password: '', passwordconf: ''};
  team: any = {
    acronym: '',
    name: '',
  };

  constructor(
      public router: Router, public formService: FormService,
      public acc: AccountService, public api: ApiService) {
    this.form = this.formService.signupForm();
  }

  onClickSubmit(val: any): void {
    // Submit
    this.acc
        .signup(
            {username: val.username, password: val.password, email: val.email},
            {acronym: val.acronym.toUpperCase(), name: val.teamName})
        .then(() => {
          // Add to the mailing lists if applicable
          if (val.mailUpdates) {
            this.api
                .run(
                    'post', `/emails/addToMailingList`,
                    `&email=${val.email}&list=updates`, {})
                .then(res => {
                  console.log('Signed up for updates');
                })
                .catch(err => {
                  alert(err);
                  console.error(err);
                });
          }
          if (val.mailNewsletter) {
            this.api
                .run(
                    'post', `/emails/addToMailingList`,
                    `&email=${val.email}&list=newsletter`, {})
                .then(res => {
                  console.log('Signed up for newsletter');
                })
                .catch(err => {
                  alert(err);
                  console.error(err);
                });
          }
          // Do post-signup stuff
          if (this.acc.team.verified !== true &&
              environment.envName === 'prod') {
            this.acc.logout().then(() => {
              alert(
                  `Successfully created an account. Please verify your email address for ${val
                      .teamName} to start playing.`);
              this.router.navigate(['/home']);
            });
          }
        });
  }
}
