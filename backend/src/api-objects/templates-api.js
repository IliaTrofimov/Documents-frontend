const APIObject = require("./api-object").APIObject;

class TemplatesAPI extends APIObject{ 
    constructor(db_table){
        super(db_table, "/templates");
    }
    
    async post(obj, res){  
        await this.db_table.create({fields: obj.fields, author: obj.author, type: obj.type}).then(data => {
            console.log(`200 POST ${this._name}`)
            res.status(200).json(data);
        }).catch(err => {
            console.log(`500 POST ${this._name}:\n${err}`);
            res.sendStatus(500);
        });
    }
}

class TemplateTypesAPI extends APIObject{ 
    constructor(db_table){
        super(db_table, "/templates_typess")
        this.db_table = db_table;
    }
    
    async post(name, res){
        if(!name) {
            console.log(`400 POST ${this._name}`)
            return res.sendStatus(400);
        }
    
        await db.TemplateType.create({name: name}).then(data => {
            console.log(`200 POST ${this._name}`);
            res.send(data)
        }).catch(err => {;
            console.log(`500 POST ${this._name}:\n${err}`);
            res.sendStatus(500);
        });
    }
}

module.exports.TemplatesAPI = TemplatesAPI;
module.exports.TemplateTypesAPI = TemplateTypesAPI;