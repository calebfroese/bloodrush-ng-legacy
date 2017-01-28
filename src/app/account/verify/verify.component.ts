import { Component } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';

import { ApiService } from './../../shared/api/api.service';

@Component({
    template: `Verifying...`
})
export class VerifyComponent {
    constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {
        // Activate the token
        this.route.params.forEach((params: Params) => {
            let token = params['token'];
            if (token) {
                this.api.run('post', '/emails/verifyEmail', `&token=${token}`, {}).subscribe(res => {
                    alert('Successfully validated your account.');
                    this.router.navigate(['/login']);
                });
            } else {
                alert('No token');
            }
        });
    }
}
