import { Injectable } from '@angular/core';

import { MongoService } from './../mongo/mongo.service';

@Injectable()
export class AccountService {
    constructor(private mongo: MongoService) { }

    loadAccount(_id: string): Promise<any> {
        return this.mongo.run('users', 'oneById', { _id: _id })
    }

    logout(): Promise<any> {
        return new Promise((resolve, reject) => {
            localStorage.clear();
            resolve(true);
        });
    }

    setLoginVariables(_id: string): void {
        localStorage.setItem('_id', _id);
    }
}
