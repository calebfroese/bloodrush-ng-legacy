import { Component } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';

import { MongoService } from './../../mongo/mongo.service';

@Component({
    template: `Verifying...`
})
export class VerifyComponent {
    constructor(private mongo: MongoService, private route: ActivatedRoute, private router: Router) {
        // Activate the token
        this.route.params.forEach((params: Params) => {
            if (params['token']) {
                this.mongo.run('accounts', 'validateToken', {
                    token: params['token']
                }).then(res => {
                    this.router.navigate(['/login']);
                }).catch(err => {
                    this.router.navigate(['/login']);
                });
            } else {
                alert('No token');
            }
        });
    }
}
