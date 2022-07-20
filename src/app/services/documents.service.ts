import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Document } from '../models/document';
import { AppConfig } from '../configurations/app.config';
import { DocumentDataItem } from '../models/document-data-item';
import { catchError, throwError } from 'rxjs';
import { SiteErrorCodes } from '../models/site-error';
import { AlertService } from './alert.service';


/** Сревис для работы с документами. Автомматически обрабатывает ошибки, выводит уведомления через alert.service */
@Injectable()
export class DocumentsService{
    private url = "";
    
    constructor(private http: HttpClient, 
        private config: AppConfig, 
        private alertSvc: AlertService){
        this.url = this.config.apiUrl + "/documents";
    }

    /** Возвращает число элементов
    * @param query - фильтр, параметры для фильтра:
    * * page - номер страницы пагинатора
    * * pageSize - количество элементов на странице
    * * user - (string) CWID автора документа (по умолчанию undefined - без фильтра)
    * * template - Id шаблона документа (по умолчанию -1 - без фильтра)
    * * type - значение статуса в документа (по умолчанию -1 - без фильтра)
    */
    count(query?: { [param: string]: any }){
        const options = query ? { params: new HttpParams().appendAll(query) } : {};
        return this.http.get<number>(`${this.url}/count`, options);
    }

    
    /** Возвращает список документов
    * @param query - фильтр, параметры для фильтра:
    * * page - номер страницы пагинатора
    * * pageSize - количество элементов на странице
    * * user - (string) CWID автора документа (по умолчанию undefined - без фильтра)
    * * templateId - Id шаблона документа (по умолчанию -1 - без фильтра)
    * * type - значение статуса в документа (по умолчанию -1 - без фильтра)
    */
    getDocuments(query?: { [param: string]: any }){
        const options = query ? { params: new HttpParams().appendAll(query) } : {};
        return this.http.get<Document[]>(`${this.url}/list`, options);
    }

    getDocument(id: number){
        return this.http.get<Document>(`${this.url}/${id}/get`).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось загрузить документ", {message: "Данные не найдены."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось загрузить документ", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        );
    }

    updateDocument(document: Document){
        const body = {
            Name: document.Name,
            ExpireDate: document.ExpireDate,
            Type: document.Type
        }
        return this.http.put(`${this.url}/${document.Id}/put`, body).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось изменить документ", {message: "Данные не найдены."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось изменить документ", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    updateItem(docId: number, item: DocumentDataItem){
        return this.http.put<Document>(`${this.url}/${docId}/put-field`, item).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось изменить данные", {message: "Данные не найдены."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось изменить данные", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    updateToTemplate(id: number){
        return this.http.put(`${this.url}/${id}/update`, document);
    }

    createDocument(name: string, templateId: number, previousVersionId?: number){
        const body = {
            Name: name,
            TemplateId: templateId, 
            PreviousVersionId: previousVersionId,
            AuthorId: 0
        };
        return this.http.post<number>(`${this.url}/post`, body).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    this.alertSvc.error("Не удалось создать документ", {message: JSON.stringify(error.error, null, 2)}); 
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }

    deleteDocument(id: number){
        return this.http.delete(`${this.url}/${id}/delete`).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse){
                    switch (error.status){
                        case SiteErrorCodes.NotFound: 
                            this.alertSvc.error("Не удалось удалить документ", {message: "Данные уже удалены."}); 
                            break;
                        default: 
                            this.alertSvc.error("Не удалось удалить документ", {message: JSON.stringify(error.error, null, 2)}); 
                            break;
                    }
                }
                return throwError(() => new Error(error.message))
            })
        ); 
    }
}