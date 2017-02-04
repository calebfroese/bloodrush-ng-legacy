import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AccountService } from './../../shared/account.service';

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

    constructor(private router: Router, private acc: AccountService) { }

    onClickSubmit(val: any): void {
        if (val.username && val.password) {
            this.acc.login(val.username, val.password)
                .then(response => {
                    this.acc.loadTeam()
                        .then(() => {
                            this.router.navigate(['/home']);
                        });
                })
                .catch(err => {
                    alert(err);
                });
        }
    }
}
