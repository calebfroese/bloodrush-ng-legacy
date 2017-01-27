import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { } from 'loopback-sdk-angular-cli';

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
                resolve(this.extractData(response));
            });
        });
    }

    // signup(user: any, team: any): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this.http.post(`${Config[environment.envName].apiUrl}/accounts/signup`, { 'user': user, 'team': team }).subscribe(response => {
    //             let reply = this.extractData(response);
    //             if (reply.error) {
    //                 reject(reply.error);
    //             } else {
    //                 resolve(reply);
    //             }
    //         });
    //     });
    // }

    // login(username: string, password: string): Promise<anyp {
    //     return new Promise((resolve, reject) => {
    //         this.http.post(`${Config[environment.envName].apiUrl}/accounts/login`, { 'username': username, 'password': password }).subscribe(response => {
    //             let reply = this.extractData(response);
    //             if (reply.error) {
    //                 reject(reply.error);
    //             } else {
    //                 resolve(reply);
    //             }
    //         });
    //     });
    // }

    extractData(res: Response) {
        try {
            let body = res.json();
            return body || {};
        } catch (err) {
            return null;
        }
    }
}
