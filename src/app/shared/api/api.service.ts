import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Config } from './../../shared/config';
import { environment } from './../../../environments/environment';

const apiURL = 'http://0.0.0.0:3000/api';
const request = require('request');

@Injectable()
export class ApiService {
    sessionId: string;

    constructor(private http: Http) { }

    auth(): string {
        return 'access_token=' + this.sessionId;
    }

    /**
     * @param {string} method post, patch, get, etc
     * @param {string} modelUrl e.g. '/leagues'
     * @param {string} queryString beginning with & e.g. &email=test@example.com&password=123
     */
    run(method: string, modelUrl: string, queryString: string, params: any): Observable<any> {
        let req = {
            method: method,
            uri: `${apiURL}${modelUrl}?${this.auth()}${queryString}`,
            json: true,
            body: params
        };
        return new Observable(observer => {
            request(req, (error, response, body) => {
                if (error) {
                    return console.log('Error:', error);
                }
                if (response.statusCode !== 200) {
                    return console.log('Invalid Status Code Returned:', response.statusCode);
                }
                observer.next(body);
                observer.complete();
            });
        });
    }

    parseJSON(stringJSON: any): any {
        return JSON.parse(stringJSON);
    }
}
