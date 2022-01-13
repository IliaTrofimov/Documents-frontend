import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { InputField, RestrictionTypes } from "../models";

@Injectable()
export class ValidationService{
    registryUrl: string = environment.apiUrl + "/registry";
    
    constructor(private http: HttpClient){}
    
    public checkInput(field: InputField, input?: string): boolean {
        if((input == undefined || input == "") && !field.required) 
            return true;
        else if(!input) 
            return false;
        else {
            switch(field.restrictType){
                case RestrictionTypes.None: return true;
                case RestrictionTypes.Only: return input in field.restrictions.split(';');
                case RestrictionTypes.None: return !(input in field.restrictions.split(';'));
                case RestrictionTypes.Registry: return false;
                default: return false;
            }
        }
    }

    public checkRestriction(field: InputField): boolean {
        switch(field.restrictType){
            case RestrictionTypes.None: return !field.restrictions || field.restrictions == "";
            case RestrictionTypes.Only: 
            case RestrictionTypes.None: return field.restrictions.split(';').length != 0;
            case RestrictionTypes.Registry: return true;
            default: return false;
        }
    }

    public getRegistryValue(registryField: string){
        return "";
    }

}