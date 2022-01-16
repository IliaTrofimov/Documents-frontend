const APIObject = require("./api-object").APIObject;

class DocumentsDataAPI extends APIObject{ 
    constructor(db_table){
        super(db_table, "/documents_data")
    }
    
    async post(obj, res){
        if(!obj) {
            console.log(`400 POST ${this._name}`)
            return res.sendStatus(400);
        }
    
        await this.db_table.create({id: obj.id, data: obj.data}).then(data => {
            console.log(`200 POST ${this._name}`)
            res.status(200).json(data);
        }).catch(err => {
            console.log(`500 POST ${this._name}:\n${err}`);
            res.sendStatus(500);
        });
    }
}

class DocumentsInfoAPI extends APIObject{ 
    constructor(db_table){
        super(db_table, "/documents")
    }
    
    async post(obj, res){
        if(!obj) {
            console.log(`400 POST ${this._name}`)
            return res.sendStatus(400);
        }
    
        await this.db_table.create({templateId: obj.templateId}).then(data => {
            console.log(`200 POST ${this._name}`)
            res.status(200).json(data);
        }).catch(err => {
            console.log(`500 POST ${this._name}:\n${err}`);
            res.sendStatus(500);
        });
    }
}

module.exports.DocumentsDataAPI = DocumentsDataAPI;
module.exports.DocumentsInfoAPI = DocumentsInfoAPI;