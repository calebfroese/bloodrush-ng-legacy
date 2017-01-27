import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MongoService } from './../../mongo/mongo.service';

@Component({
    templateUrl: './signup.component.html'
})
export class SignupComponent {
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

    constructor(private router: Router, private mongo: MongoService) { }

    onClickSubmit(): void {
        // When the user submits their signup form
        // TODO Validate stuff
        if (this.user.username.length < 4) {
            alert('Username must be at least 4 characters');
            return;
        }
        if (this.user.email.length < 4) {
            alert('Email must be at least 4 characters');
            return;
        }
        if (this.user.password.length < 5) {
            alert('Password must be at least 5 characters');
            return;
        }
        if (this.user.password !== this.user.passwordconf) {
            alert('Passwords do not match');
            return;
        }
        // Team
        if (this.team.acronym.length < 2) {
            alert('Acronym must be at least 2 characters');
            return;
        }
        if (this.team.name.length < 3) {
            alert('Team name must be at least 3 characters');
            return;
        }
        // Submit to mongo
        this.mongo.signup(this.user, this.team).then(response => {
            if (response.error) {
                alert(response.error);
            } else if (response.ok) {
                this.router.navigate(['/login']);
            } else {
                alert('No response');
            }
        }).catch(err => alert(err));
    }
}
