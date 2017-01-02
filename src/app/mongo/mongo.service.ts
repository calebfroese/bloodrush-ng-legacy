import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class MongoService {
    apiUrl: string = 'http://localhost:3000/query/teams/all';

    constructor(private http: Http) { }

    fetchTeams(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(this.apiUrl, {}).subscribe(teamsArr => {
                resolve(teamsArr);
            });
        });
    }

    fetchTeamById(teamId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(this.apiUrl, { '_id': teamId }).subscribe(response => {
                // Return the single team object
                resolve(this.extractData(response)[0]);
            });
        });
    }

    extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}
