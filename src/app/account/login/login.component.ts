import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MongoService } from './../../mongo/mongo.service';

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent {
    username: string;
    password: string;

    constructor(private mongo: MongoService, private router: Router) { }

    onClickSubmit(): void {
        if (this.username && this.password) {
            this.mongo.login(this.username, this.password).then(response => {
                if (response.error) {
                    alert(response.error);
                } else {
                    this.router.navigate(['/home']);
                }
            }).catch(err => {
                alert(err);
            });
        }
    }
}
