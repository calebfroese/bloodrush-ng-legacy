import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { FormService } from './../../shared/forms/form.service';
import { MongoService } from './../../mongo/mongo.service';
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

    constructor(private router: Router, private mongo: MongoService, private formService: FormService) {
        this.form = this.formService.signupForm();
    }

    onClickSubmit(val: any): void {
        // Submit to mongo
        this.mongo.signup({
            username: val.username,
            password: val.password,
            email: val.email
        }, {
                acronym: val.acronym,
                teamName: val.teamName
            }).then(response => {
                if (response.error) {
                    alert(response.error);
                } else if (response.ok) {
                    
                    alert(`Successfully created an account. Please verify your email address for ${val.teamName} to start playing.`);
                } else {
                    alert('No response');
                }
            }).catch(err => alert(err));
    }
}
