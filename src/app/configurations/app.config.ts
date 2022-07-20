import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";


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
        return new Promise<void>(async (resolve, reject) => {
            try {
                this._config = await firstValueFrom<IConfiguration>(this.http.get<IConfiguration>("config.json"));
                console.log(`App has been initialized ${this._config.Production ? '[DEBUG MODE]' : ''}`);
            }    
            catch (e) {
                this._config = defaultConfig;
                console.log(`Config file is unavaliable (${e})`);
                console.log("App has been initialized with default config");
            }
            resolve();
        });
    }

    get config(): IConfiguration {
        return this._config;
    }

    get apiUrl(): string {
        return this._config.ApiUrl;
    }

    /** вывод служебной информации о сервере (можно удалить вместе с debug.component) */
    serverTest(){
        return this.http.get<any>(this.apiUrl + '/default/list');
    }

    currentUser(){
        return this.http.get<any>(this.apiUrl + '/default/user');
    }

}