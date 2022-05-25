import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Document, DocumentStatus } from '../models/document';
import { AppConfig } from '../app.config';
import { DocumentDataItem } from '../models/document-data-item';
import { catchError, throwError } from 'rxjs';
import { SiteErrorCodes } from '../models/site-error';
import { AlertService } from './alert.service';
import { UsersService } from './users.service';


@Injectable()
export class DocumentsService{
    private url = "";
    
    constructor(private http: HttpClient, 
        private config: AppConfig, 
        private alertSvc: AlertService){
        this.url = this.config.apiUrl + "/documents";
    }
    

    getDocuments(type?: DocumentStatus){
        return this.http.get<Document[]>(`${this.url}/list`);
    }

    getDocument(id: number){
        return this.http.get<Document>(`${this.url}/${id}/get`);
    }

    updateDocument(document: Document){
        return this.http.put(`${this.url}/${document.Id}/put`, document).pipe(
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
        return this.http.put(`${this.url}/${docId}/put-field`, item).pipe(
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