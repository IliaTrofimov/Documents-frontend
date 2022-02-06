module.exports.JoinedDocument = class JoinedDocument { 
    constructor(data_table, info_table, template_table){
        this.data_table = data_table;
        this.info_table = info_table;
        this.template_table = template_table;
        this._name = "/document_joined";
    }
    
    async get(id, res){
        await this.info_table.findByPk(id).then(info => {
            if(!this._checkData(info, id, res)) return;

            info.getDocumentData().then(data => {
                if(!this._checkData(data, id, res)) return;

                info.getTemplate().then(temp => {
                    if(!this._checkData(temp, id, res)) return;

                    console.log(`200 GET ${this._name}/${id}`);
                    res.status(200).json({info: info, data: data, template: temp});
                });
            });
        }).catch(err => {
            console.log(`500 GET ${this._name}/${id}:\n${err}`);
            res.sendStatus(500);
        })
    }

    async delete(id, res){
        await this.info_table.destroy({ where: { id: id }}).then(() => 
            this.data_table.destroy({ where: { id: id }}).then(() => {
                console.log(`200 DELETE ${this._name}/${id}`);
                res.status(200).json(undefined);
            })
        ).catch(err => {
            console.log(`500 DELETE ${this._name}/${id}:\n${err}`);
            res.sendStatus(500);
        });
    }

    async post(templateId, res, prevVersionId=undefined){
        if(!templateId) {
            console.log(`400 POST ${this._name}`);
            return res.sendStatus(400);
        }
        
        await this.template_table.findByPk(templateId).then(temp =>{
            if(!temp){
                console.log(`400 POST ${this._name}`);
                return res.status(400).send(`Cannot create document with given template's id (${templateId}), 
                                            such template does not exist!`);
            }
            else if(temp.depricated == 1){
                console.log(`409 POST ${this._name}`);
                return res.status(400).send(`Cannot create document with given template's id (${templateId}), 
                                            template is depricated!`);
            }
        })

        let data = prevVersionId ? await this.data_table.findByPk(prevVersionId) : "[]";
        await this.info_table.create({templateId: templateId}).then(info => {
            info.createDocumentData({data: data}).then((_data) => {
                console.log(`200 POST ${this._name}`);
                res.status(200).json(_data.id);
            }).catch(err => {
                console.log(`500 POST ${this._name}:\n${err}`);
                res.sendStatus(500); 
            })
        }).catch(err => {
            console.log(`500 POST ${this._name}:\n${err}`);
            res.sendStatus(500);
        });
    }

    async put(info, data, res){
        if(!info || !data) {
            console.log(`400 PUT ${this._name}/${info.id}`)
            return res.sendStatus(400);
        }

        await this.info_table.update(info, {where: { id: info.id }}).catch(err => {
            console.log(`500 PUT ${this._name}/${info.id}:\n${err}`);
            res.sendStatus(500);
        });
        
        await this.data_table.update(data, {where: { id: info.id }}).then(() => {
            console.log(`200 PUT ${this._name}/${info.id}`);
            res.status(200).send({});
        }).catch(err => {
            console.log(`500 PUT ${this._name}/${info.id}:\n${err}`);
            res.sendStatus(500);
        });       
    }
    
    
    _checkData(data, id, res) {
        if(!data){
            res.status(404).json(data);
            console.log(`404 GET ${this._name}/${id}`);
            return false;
        }
        return true;
    }
}
