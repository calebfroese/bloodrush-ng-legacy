import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

import { environment } from "../../../environments/environment";

import { Config } from "./../../shared/config";

@Injectable()
export class ApiService {
  sessionId: string;

  constructor(public http: Http) {
    // Determine if fallback to the internal IP is neccesary
    if (localStorage.getItem("prodMode") === "localProd") this.useLocalProd();
    this.testConnectionToServer()
      .then(() => {
        this.useExternalProd();
      })
      .catch(() => {
        this.useLocalProd();
      });
  }

  useLocalProd() {
    localStorage.setItem("prodMode", "localProd");
    Config.prod = Config.localProd;
  }

  useExternalProd() {
    localStorage.setItem("prodMode", "externalProd");
    Config.prod = Config.externalProd;
  }

  testConnectionToServer(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.run("get", "/leagues", "", {})
        .then(stuff => {
          resolve();
        })
        .catch(err => {
          reject();
        });
      setTimeout(() => {
        reject();
      }, 1000);
    });
  }

  auth(): string {
    return "access_token=" + this.sessionId;
  }

  /**
   * @param {string} method post, patch, get, etc
   * @param {string} modelUrl e.g. '/leagues'
   * @param {string} queryString beginning with & e.g.
   * &email=test@example.com&password=123
   */
  run(
    method: string,
    modelUrl: string,
    queryString: string,
    params: any
  ): Promise<any> {
    let req = {
      method: method,
      uri: `${
        Config[environment.envName].apiUrl
      }${modelUrl}?${this.auth()}${queryString}`,
      json: true,
      body: params
    };
    switch (method) {
      case "post":
        return this.http.post(req.uri, params).toPromise();
      case "patch":
        return this.http.post(req.uri, params).toPromise();
      default:
        return this.http.get(req.uri).toPromise();
    }
  }
}
