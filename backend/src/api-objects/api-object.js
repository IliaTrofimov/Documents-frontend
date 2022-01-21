module.exports.APIObject = class APIObject{ 
    constructor(db_table, name){
        this.db_table = db_table;
        this._name = name;
    }
    
    async getAll(res, where = undefined){
        if(where != undefined){
            await this.db_table.findAll({raw: true, where: where}).then(data => {
                console.log(`200 GET ${this._name}`);
                res.status(200).json(data);
            }).catch(err => {
                console.log(`500 GET ${this._name}:\n${err}`);
                res.sendStatus(500);
            });
        }
        else{
            await this.db_table.findAll({raw: true}).then(data => {
                console.log(`200 GET ${this._name}`);
                res.status(200).json(data);
            }).catch(err => {
                console.log(`500 GET ${this._name}:\n${err}`);
                res.sendStatus(500);
            });
        }
    }
    
    async getOne(id, res){
        await this.db_table.findByPk(id).then(data => {
            if(data != undefined){
                console.log(`200 GET ${this._name}/${id}`);
                res.status(200).json(data);
            } 
            else{
                console.log(`404 GET ${this._name}/${id}`);
                res.sendStatus(404);
            }
        }).catch(err => {
            console.log(`500 GET ${this._name}/${id}:\n${err}`);
            res.sendStatus(500);
        });
    }

    async put(obj, res){
        if(!obj) {
            console.log(`400 PUT ${this._name}/${obj.id}`)
            return res.sendStatus(400);
        }
    
        await this.db_table.update(obj, {
            where: { id: obj.id }
        }).then(data => {
            if(data != undefined){
                console.log(`200 PUT ${this._name}/${obj.id}`);
                res.status(200).json(data);
            } 
            else{
                console.log(`404 PUT ${this._name}/${obj.id}`);
                res.sendStatus(404);
            }
        }).catch(err => {
            console.log(`500 PUT ${this._name}/${obj.id}:\n${err}`);
            res.sendStatus(500);
        });
    }
    
    async delete(id, res){
        await this.db_table.destroy({
            where: { id: id }
        }).then(data => {
            console.log(`200 DELETE ${this._name}/${id}`);
            res.status(200).json(data);
        }).catch(err => {
            console.log(`500 DELETE ${this._name}/${id}:\n${err}`);
            res.sendStatus(500);
        });
    }
}