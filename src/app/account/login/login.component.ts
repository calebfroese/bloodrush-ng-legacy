import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from './../../shared/account.service';
import { MongoService } from './../../mongo/mongo.service';

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent {
    username: string;
    password: string;

    constructor(private mongo: MongoService, private router: Router, private acc: AccountService) { }

    onClickSubmit(): void {
        if (this.username && this.password) {
            this.mongo.login(this.username, this.password)
                .then(response => {
                    if (response.error) {
                        alert(response.error);
                    } else {
                        this.acc.setLoginVariables(response._id);
                        this.router.navigate(['/home']);
                    }
                }).catch(err => {
                    alert(err);
                });
        }
    }
}
