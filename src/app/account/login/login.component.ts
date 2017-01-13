import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AccountService } from './../../shared/account.service';
import { MongoService } from './../../mongo/mongo.service';

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent {
    username: string;
    password: string;
    form = new FormGroup({
        username: new FormControl('', Validators.minLength(4)),
        password: new FormControl('', Validators.minLength(6)),
    });

    constructor(private mongo: MongoService, private router: Router, private acc: AccountService) { }

    onClickSubmit(e: any): void {
        if (e.value.username && e.value.password) {
            this.mongo.login(e.value.username, e.value.password)
                .then(response => {
                    this.acc.setLoginVariables(response._id);
                    this.router.navigate(['/home']);
                }).catch(err => {
                    alert(err);
                });
        }
    }
}
