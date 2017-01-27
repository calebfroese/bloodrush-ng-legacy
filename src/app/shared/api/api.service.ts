import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

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
    run(method: string, modelUrl: string, params: any): Observable<any> {
        return this.http[method](`${Config[environment.envName].apiUrl}${modelUrl}${this.auth()}`, params).map((response: any) => { return this.parseJSON(response._body) });
    }

    parseJSON(stringJSON: any): any {
        return JSON.parse(stringJSON);
    }
}
