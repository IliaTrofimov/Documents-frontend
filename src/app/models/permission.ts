export enum PermissionFlag {
    None = 0, 
    ReadDocuments = 0b1, WriteReadDocuments = 0b11,
    ReadTemplates = 0b100, WriteReadTemplates = 0b1100,
    EditDictionares = 0b10000,
    FullAccess = 0b11111,
}

export class Permission {
    static create(...flags: PermissionFlag[]){
        let permission = PermissionFlag.None;
        for (let flag of flags)
            permission = permission ^ flag;
        return permission;
    }

    static has(permission: number, flag: PermissionFlag)  {
        return  (permission & flag) == flag;
    }

    static toString(permission: number) {  
        return this.toArray(permission).join(", ");
    }

    static toArray(permission: number) {
        if (permission == 0)
            return ["нет прав"];

        let res: string[] = []; 

        if (this.has(permission, PermissionFlag.WriteReadDocuments))
            res.push("чтение/редактирование документов");
        else if (this.has(permission, PermissionFlag.ReadDocuments))
            res.push("чтение документов");

        if (this.has(permission, PermissionFlag.WriteReadTemplates))
            res.push("чтение/редактирование шаблонов");
        else if (this.has(permission, PermissionFlag.ReadTemplates))
            res.push("чтение шаблонов");

        if (this.has(permission, PermissionFlag.EditDictionares))
            res.push("редактирование вспомогательной информации");
        
        return res;
    }
}