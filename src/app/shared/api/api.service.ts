import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Config } from './../../shared/config';
import { environment } from './../../../environments/environment';

@Injectable()
export class ApiService {
    sessionId: string;

    constructor(private http: Http) { }

    auth(): string {
        return '?access_token=' + this.sessionId;
    }

    /**
     * @param {string} method // post, patch, get, etc
     * @param {string} modelUrl // e.g. '/leagues'
     */
    run(method: string, modelUrl: string, params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http[method](`${Config[environment.envName].apiUrl}${modelUrl}${this.auth()}`, params).subscribe(response => {
                resolve(response);
            });
        });
    }
}
