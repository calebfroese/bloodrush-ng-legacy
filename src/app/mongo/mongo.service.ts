import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class MongoService {
    apiUrl: string = 'http://localhost:3000/query';

    constructor(private http: Http) { }

    run(collection: string, queryname: string, params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.apiUrl}/${collection}/${queryname}`, params).subscribe(response => {
                resolve(this.extractData(response));
            });
        });
    }

    signup(user: any, team: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.apiUrl}/accounts/signup`, { 'user': user, 'team': team }).subscribe(response => {
                let reply = this.extractData(response);
                if (reply.error) {
                    reject(reply.error);
                } else {
                    resolve(reply);
                }
            });
        });
    }

    login(username: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.apiUrl}/accounts/login`, { 'username': username, 'password': password }).subscribe(response => {
                let reply = this.extractData(response);
                if (reply.error) {
                    reject(reply.error);
                } else {
                    resolve(reply);
                }
            });
        });
    }

    extractData(res: Response) {
        try {
            let body = res.json();
            return body || {};
        } catch (err) {
            return null;
        }
    }
}
