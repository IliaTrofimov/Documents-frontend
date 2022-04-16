import { HttpClient } from "@angular/common/http";
import { Expression } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { IConfiguration } from "./configurations/config-interface";
import { User } from "./models/user";


@Injectable({providedIn: 'root'})
export class AppConfig {
    private _user?: User;
    private _lastAuthentication?: Date;

    private _configPath: string = "../configurations/config.json";
    private _config: IConfiguration = {
        Production: false,
        ApiUrl: "https://localhost:44381/api",
        Active: false,
        ServiceMessage: "Ресурс недоступен, попробуйте обновить страницу позднее."
    };

    constructor(private http: HttpClient) { }

    load(): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            try {
                //this._config = require(this._configPath);  
                throw new Error(); 
            }    
            catch {
                this._config = {
                    Production: false,
                    ApiUrl: "https://localhost:44381/api",
                    Active: true,
                    ServiceMessage: "Ресурс недоступен, попробуйте обновить страницу позднее."
                };
            }
            console.log("App has been initialized");
            resolve();
        });
    }

    get config(): any {
        return this._config;
    }

    get apiUrl(): string {
        return this._config.ApiUrl;
    }

    auth() {
        console.log(`Last known user is ${this._user}`);
        console.log(`Trying get current user (last auth ${this._lastAuthentication})`);
        this._lastAuthentication = new Date();
       
        return this.http.get<User>(`${this.apiUrl}/users/whoami`).pipe(map(usr => {
            this._user = usr;
            return this._user;
        })); 
    }

    get userId() {
        return this._user?.Id;
    }

}