import { Component } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';

import { ApiService } from './../../shared/api/api.service';

@Component({
    template: `Verifying...`
})
export class VerifyComponent {
    constructor(public api: ApiService, public route: ActivatedRoute, public router: Router) {
        // Activate the token
        this.route.params.forEach((params: Params) => {
            let token = params['token'];
            if (token) {
                this.api.run('post', '/emails/verifyEmail', `&token=${token}`, {}).then(res => {
                    alert('Successfully validated your account.');
                    this.router.navigate(['/login']);
                });
            } else {
                alert('No token');
            }
        });
    }
}
