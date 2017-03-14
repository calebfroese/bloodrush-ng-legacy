import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import {environment} from '../../../environments/environment';

import {Config} from './../../shared/config';

const request = require('request');

@Injectable()
export class ApiService {
  sessionId: string;

  constructor(private http: Http) {}

  auth(): string {
    return 'access_token=' + this.sessionId;
  }

  /**
   * @param {string} method post, patch, get, etc
   * @param {string} modelUrl e.g. '/leagues'
   * @param {string} queryString beginning with & e.g.
   * &email=test@example.com&password=123
   */
  run(method: string, modelUrl: string, queryString: string,
      params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let req = {
        method: method,
        uri: `${Config[environment.envName].apiUrl
             }${modelUrl}?${this.auth()}${queryString}`,
        json: true,
        body: params
      };
      request(req, (error, response, body) => {
        if (error) {
          console.error('Error:', error);
        }
        if (response.statusCode !== 200) {
          console.error('Invalid Status Code Returned:', response.statusCode);
          reject();
        }
        resolve(body);
      });
    });
  }

  parseJSON(stringJSON: any): any {
    return JSON.parse(stringJSON);
  }
}
