import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import config from  "./config.json"


interface IConfiguration{
    Production: boolean,
    ApiUrl: string,
    Active: boolean,
    ServiceMessage: string
}

const defaultConfig: IConfiguration = {
    Production: false,
    ApiUrl: "http://localhost:56065",
    Active: false,
    ServiceMessage: "Ресурс недоступен, попробуйте обновить страницу позднее."
};


@Injectable({providedIn: 'root'})
export class AppConfig {
    constructor(private http: HttpClient){}

    private _config: IConfiguration = defaultConfig;

    load(): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            try {
                this._config = config 
            }    
            catch {
                this._config = defaultConfig
            }
            console.log("App has been initialized");
            resolve();
        });
    }

    get config(): IConfiguration {
        return this._config;
    }

    get apiUrl(): string {
        return this._config.ApiUrl;
    }

    serverTest(){
        return this.http.get<any>(this.apiUrl + '/default/list');
    }

    currentUser(){
        return this.http.get<any>(this.apiUrl + '/default/user');
    }

}