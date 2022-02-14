import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DocumentInfo, DocTypes, DocumentData, DocumentDataItem, Merged, DocumentDataTable } from '../models/document-models';
import { DocTemplate, TableField, TemplateField, TemplateRow } from "../models/template-models";
import { map } from 'rxjs';
import { UsersService } from './users.service';


@Injectable()
export class DocumentsService{
    private infoUrl = environment.apiUrl + "/documents";
    private dataUrl = environment.apiUrl + "/documents_data";
    private joinUrl = environment.apiUrl + "/document_joined";
    
    constructor(private http: HttpClient, private usersServ: UsersService){}
    
    checkDocumentData(data: DocumentData, template: DocTemplate){
        let changed = false;
        let newFields: DocumentDataItem[] = [];
        let newTables: DocumentDataTable[] = [];

        for (let field of template.fields){
            if (field.type == TemplateField.InputField) {
                let foundField = data.fields.find(d => d.id == field.id)
                if (foundField)
                    newFields.push(foundField);
                else {
                    changed = true;
                    newFields.push(new DocumentDataItem(field.id))
                }   
            }
            else if (field.type == TemplateField.TableField){
                let foundTable = data.tables.find(d => d.id == field.id);
                if (!foundTable) {
                    foundTable = new DocumentDataTable(field.id);
                }    
                newTables.push(foundTable);                    
                changed = this.checkDocumentTable(foundTable, field as TableField) || changed;  
            }
        }

        data.fields = newFields;
        data.tables = newTables;
        return changed;
    }


    checkDocumentTable(table: DocumentDataTable, template: TableField){
        let changed = false;
        const rows = template.rows;
        let newColumns = new Array<{id: number, values: string[]}>();

        for (let col of template.columns){
            let foundCol = table.columns.find(c => c.id == col.id); 
            if (!foundCol) {
                changed = true;
                newColumns.push({ id: col.id, values: new Array<string>(rows).fill("") })
            }
            else{
                if (foundCol.values.length > rows) {
                    changed = true;
                    foundCol.values.splice(rows - 1);
                }
                else if (foundCol.values.length < rows) {
                    changed = true;                   
                    foundCol.values.push(...(new Array<string>(rows - foundCol.values.length).fill("")));
                }
                newColumns.push(foundCol);
            }
        }
        table.columns = newColumns;
        return changed;
    }

    getInfos(type?: DocTypes){
        return this.http.get<DocumentInfo[]>(this.infoUrl).pipe(map(items => {
            return items.map(info => {
                this.usersServ.getUser(info.author).subscribe({
                    next: user => info.authorName = user.name,
                    error: () => info.authorName = "неизвестно"
                });
                return info;
            })
        }));
    }

    getJoinedDocument(id: number){
        return this.http.get<any>(`${this.joinUrl}/${id}`).pipe(
            map(item => {
                console.log('get.tables str\n', item.data.tables);
                item.data.fields = JSON.parse(item.data.fields) as DocumentDataItem[];
                item.data.tables = JSON.parse(item.data.tables) as DocumentDataTable[];
                item.template.fields = JSON.parse(item.template.fields as any) as TemplateRow[];
                console.log('get.tables', item.data.tables);
                return item as Merged;
            }) 
        )
    }

    deleteJoinedDocument(id: number){
        return this.http.delete(`${this.joinUrl}/${id}`);
    }

    updateJoinedDocument(data: DocumentData, info: DocumentInfo){
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        const body = {info: info, data: {
            id: data.id, fields: JSON.stringify(data.fields), tables: JSON.stringify(data.tables)
        }};
        return this.http.put(`${this.joinUrl}/${info.id}`, JSON.stringify(body), {headers:myHeaders});
    }

    createJoinedDocument(templateId: number, previousVersionId?: number){
        const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
        const body = {templateId: templateId, previousVersionId: previousVersionId};
        return this.http.post<number>(this.joinUrl, JSON.stringify(body), {headers: myHeaders});
    }
}