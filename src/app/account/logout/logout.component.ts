import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from './../../shared/account.service';

@Component({
    template: `Logging out`
})
export class LogoutComponent {
    constructor(private router: Router, private acc: AccountService) {
        this.acc.logout()
        .then(() => {
            this.router.navigate(['/home']);
        })
        .catch(err => {
            console.error(err);
            this.router.navigate(['/home']);
        });
    }
}
