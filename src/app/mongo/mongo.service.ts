import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class MongoService {
    apiUrl: string = 'http://localhost:3000/query';

    constructor(private http: Http) { }

    fetchTeams(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.apiUrl}/teams/all`, {}).subscribe(response => {
                resolve(this.extractData(response));
            });
        });
    }

    fetchTeamById(teamId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.apiUrl}/teams/byId`, { '_id': teamId }).subscribe(response => {
                // Return the single team object
                resolve(this.extractData(response));
            });
        });
    }

    fetchTeamByOwner(ownerId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.apiUrl}/teams/byId`, { 'ownerId': ownerId }).subscribe(response => {
                // Return the single team object
                resolve(this.extractData(response));
            });
        });
    }

    signup(user: any, team: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.apiUrl}/users/signup`, { 'user': user, 'team': team }).subscribe(response => {
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
            this.http.post(`${this.apiUrl}/users/login`, { 'username': username, 'password': password }).subscribe(response => {
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
        let body = res.json();
        return body || {};
    }
}
