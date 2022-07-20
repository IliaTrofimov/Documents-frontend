import { Injectable } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, firstValueFrom, map } from 'rxjs';

import { AppConfig } from '../configurations/app.config';
import { AlertService } from './alert.service';


/** Сервис для печати */
@Injectable()
export class PrintingService{
    private url = "";
    
    constructor(private http: HttpClient, 
        private configSvc: AppConfig, 
        private alertSvc: AlertService,
        private fileSaverSvc: FileSaverService){
        this.url = this.configSvc.apiUrl + "/printing";
    }

    /** Получение PDF документа на основе данных документа */
    async printPdfDocument(documentId: number, name?: string){
        const pdf = await firstValueFrom(this.http.get(`${this.url}/${documentId}/document-pdf`, {responseType: 'blob'}).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse)
                    this.alertSvc.error("Не удалось создать PDF-файл", {message: JSON.stringify(error.error, null, 2)}); 
                return throwError(() => new Error(error.message))
            })
        ));
        try {
            this.fileSaverSvc.save((<Blob>pdf), `${name ? name.replace(" ", "_") : `document${documentId}`}.pdf`, "pdf");
        }
        catch (error) {
            this.alertSvc.error("Не удалось загрузить PDF-файл", {message: JSON.stringify(error, null, 2)}); 
        }
    }

    /** Выгрузка html-шаблона для заданного шаблона на сервер */
    uploadHtmlTemplate(templateId: number, file: File) {
        const formData = new FormData(); 
        formData.append("file", file, `template${templateId}-html.html`);

        return this.http.post<string>(`${this.url}/${templateId}/add-template`, formData).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse){
                    if (error.status == 404) 
                        this.alertSvc.error("Печатная форма не существует, невозможно создать PDF"); 
                    else
                        this.alertSvc.error(`Не удалось получить файл`, {message: JSON.stringify(error, null, 2)}); 
                }
                return throwError(() => new Error(error.message))
            })
        );
    }

    /** Загружает html-файл шаблона */
    async getHtmlTemplate(templateId: number, name?: string){
        const html = await firstValueFrom(this.http.get(`${this.url}/${templateId}/get-template`, {responseType: 'blob'}).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse){
                    if (error.status == 404) 
                        this.alertSvc.error("Файл не существует"); 
                    else
                        this.alertSvc.error(`Не удалось получить файл`, {message: JSON.stringify(error, null, 2)}); 
                }
                return throwError(() => new Error(error.message))
            })
        ));
        try {
            this.fileSaverSvc.save((<Blob>html), `${name ? name.replace(" ", "_") : `template${templateId}`}.html`, "html");
        }
        catch (error) {
            this.alertSvc.error("Не удалось загрузить HTML-шаблон", {message: JSON.stringify(error, null, 2)}); 
        }
    }

    /** Загружает html-шаблон для предварительного просмотра в браузере */
    previewHtmlTemplate(templateId: number){
        return this.http.get(`${this.url}/${templateId}/get-template`, {responseType: 'text'}).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse){
                    if (error.status == 404) 
                        this.alertSvc.error("Файл не существует"); 
                    else
                        this.alertSvc.error(`Не удалось получить файл`, {message: JSON.stringify(error, null, 2)}); 
                }
                return throwError(() => new Error(error.message))
            }),
            map(str => str.replaceAll("{{", '<span class="var">').replaceAll("}}", "</span>"))
        );
    }

    /** Проверяет, существует ли печатная форма */
    checkExistance(templateId: number){
        return this.http.get<boolean>(`${this.url}/${templateId}/check-existance`).pipe(
            catchError(error => {
                this.alertSvc.error(`Не удалось провеить наличие печатной формы`, {message: JSON.stringify(error, null, 2)}); 
                return throwError(() => new Error(error.message))
            }),
        );
    }

}