import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { environment } from './../../../environments/environment';
import { FormService } from './../../shared/forms/form.service';
import { AccountService } from './../../shared/account.service';
import { CustomValidators } from './../../shared/forms/custom-validators';

@Component({
    templateUrl: './signup.component.html'
})
export class SignupComponent {
    form: FormGroup;
    user: any = {
        username: '',
        email: '',
        password: '',
        passwordconf: ''
    };
    team: any = {
        acronym: '',
        name: '',
    };

    constructor(private router: Router, private formService: FormService, private acc: AccountService) {
        this.form = this.formService.signupForm();
    }

    onClickSubmit(val: any): void {
        // Submit
        this.acc.signup({
            username: val.username,
            password: val.password,
            email: val.email
        }, {
                acronym: val.acronym,
                name: val.teamName
            }).subscribe(() => {
                if (this.acc.team.verified !== true && environment.envName === 'prod') {
                    this.acc.logout().then(() => {
                        alert(`Successfully created an account. Please verify your email address for ${val.teamName} to start playing.`);
                        this.router.navigate(['/home']);
                    });
                }
            });
    }
}
