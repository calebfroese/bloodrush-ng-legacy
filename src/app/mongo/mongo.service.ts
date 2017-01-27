import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Config } from './../shared/config';
import { environment } from './../../environments/environment';

@Injectable()
export class MongoService {

    constructor(private http: Http) { }

    /**
     * @param {string} method // post, patch, get, etc
     * @param {string} modelUrl // e.g. '/leagues'
     */
    run(method: string, modelUrl: string, params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http[method](`${Config[environment.envName].apiUrl}${modelUrl}`, params).subscribe(response => {
                resolve(response);
            });
        });
    }
}
