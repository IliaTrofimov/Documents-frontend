import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Template } from '../models/template';
import { AppConfig } from '../app.config';
import { TemplateTable } from '../models/template-table';
import { TemplateField } from '../models/template-field';
import { AlertService } from './alert.service';
import { catchError, throwError } from 'rxjs';
import { SiteErrorCodes } from '../models/site-error';


@Injectable()
export class TemplatesService{
    private url = "";
    
    constructor(private http: HttpClient, private config: AppConfig, private alertSvc: AlertService){
        this.url = this.config.apiUrl + "/templates";
    }

    count(query?: { [param: string]: number }){
        const options = query ? { params: new HttpParams().appendAll(query) } : {};
        return this.http.get<number>(`${this.url}/count`, options);
    }
    
    getTemplates(query?: { [param: string]: number }){
        const options = query ? { params: new HttpParams().appendAll(query) } : {};
        return this.http.get<Template[]>(`${this.url}/list`, options);
    }
    
    getTemplate(id: number){
        return this.http.get<Template>(`${this.url}/${id}/get`);
    }

    createTemplate(template: Template){
        return this.http.post<number>(`${this.url}/post`, template).pipe(
            catchError((error) => {
                this.alertSvc.error("Не удалось создать шаблон", {message: JSON.stringify(error.error, null, 2)});
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    updateTemplate(template: Template) {
        return this.http.put<Template>(`${this.url}/${template.Id}/put`, template).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось изменить шаблон", {message: "Данные не найдены"}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось изменить шаблон", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    updateTable(templateId: number, table: TemplateTable) {
        return this.http.put<TemplateTable>(`${this.url}/${templateId}/put-table`, table).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось изменить таблицу", {message: "Данные не найдены."}); 
                            break;
                        case SiteErrorCodes.Conflict: 
                            this.alertSvc.error("Не удалось изменить таблицу", {message: "Некоторые документы уже используют эти данные."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось изменить таблицу", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    updateField(templateId: number, field: TemplateField) {
        return this.http.put<TemplateField>(`${this.url}/${templateId}/put-field`, field).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось изменить поле", {message: "Данные не найдены."}); 
                            break;
                        case SiteErrorCodes.Conflict: 
                            this.alertSvc.error("Не удалось изменить поле", {message: "Некоторые документы уже используют эти данные."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось изменить поле", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    deleteItem(templateId: number, fieldId: number, isTable: boolean) {
        return this.http.delete(`${this.url}/${templateId}/delete-${isTable ? "table" : "field"}/${fieldId}`).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось удалить элемент", {message: "Данные уже удалены."}); 
                            break;
                        case SiteErrorCodes.Conflict: 
                            this.alertSvc.error("Не удалось удалить элемент", {message: "Некоторые документы уже используют эти данные."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось удалить элемент", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    moveItems(templateId: number, fieldAId: number, fieldBId: number){
        return this.http.put(`${this.url}/${templateId}/move-items`, 
            {FirstItemId: fieldAId, SecondItemId: fieldBId}
        ).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось переместить элементы", {message: "Данные не найдены."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось переместить элементы", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    deleteTemplate(id: number){
        return this.http.delete(`${this.url}/${id}/delete`).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось удалить шаблон", {message: "Данные уже удалены."}); 
                            break;
                        case SiteErrorCodes.Conflict: 
                            this.alertSvc.error("Не удалось удалить шаблон", {message: "Некоторые документы уже используют эти данные."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось удалить шаблон", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }
}