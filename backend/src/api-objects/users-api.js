const { sequelize } = require("../database");

class UsersAPI{ 
    constructor(users_table, signatories_table, users_url, signs_url){
        this.signatories_table = signatories_table;
        this.users_table = users_table;
        this.signs_url = signs_url;
        this.users_url = users_url;
    }

    async getOneUser(id, res){
        if(!id){
            console.log(`400 GET ${this.users_url}/${id}`);
            return res.status(400).json(null);
        }

        await this.users_table.findByPk(id).then(data => {
            if(!data){
                console.log(`404 GET ${this.users_url}/${id}`);
                return res.status(404).json(null);
            }
            console.log(`200 GET ${this.users_url}/${id}`);
            res.status(200).json(data);
        }).catch(err => {
            console.log(`500 GET ${this.users_url}/${id}:\n${err}`);
            res.sendStatus(500);
        });
    }

    async search(name, res){
        if(!name){
            console.log(`400 GET ${this.users_url}/?name=${name}`);
            return res.status(400).json(null);
        }

        await this.users_table.findOne({where: {name: name}}).then(data => {
            if(!data){
                console.log(`404 GET ${this.users_url}/?name=${name}`);
                return res.status(404).json(null);
            }
            console.log(`200 GET ${this.users_url}/?name=${name}`);
            res.status(200).json(data);
        }).catch(err => {
            console.log(`500 GET ${this.users_url}/?name=${name}:\n${err}`);
            res.sendStatus(500);
        });
    }

    async getOneSign(userId, documentId, res){
        if(!userId || !documentId){
            console.log(`400 GET ${this.signs_url}/`);
            return res.status(400).json(null);
        }

        await this.signatories_table.findOne({where: {userId: userId, documentsId: documentId}}).then(data => {
            if(!data){
                console.log(`404 GET ${this.signs_url}/?userId=${userId};documentId=${userId}:\n${err}`);
                return res.status(404).send(null);
            }
            console.log(`200 GET ${this.signs_url}/?userId=${userId};documentId=${userId}`)
            res.status(200).json(data != undefined);
        }).catch(err => {
            console.log(`500 GET ${this.signs_url}/?userId=${userId};documentId=${userId}:\n${err}`);
            return res.sendStatus(500);
        });
    }

    async createSign(userId, documentId, res){
        if(!userId || !documentId){
            console.log(`400 POST ${this.signs_url}/`);
            return res.status(400).json(null);
        }

        await this.signatories_table.create({userId: userId, documentsId: documentId}).then(data => {
            console.log(`200 POST ${this.signs_url}`)
            res.status(200).json(data);
        }).catch(err => {
            console.log(`500 POST ${this.signs_url}:\n${err}`);
            res.sendStatus(500);
        });
    }

    async updateSign(userId, documentId, signed, res){
        if(!userId || !documentId){
            console.log(`400 PUT ${this.signs_url}/`);
            return res.status(400).json(null);
        }

        await this.signatories_table.update(
            {signed: signed}, {where: {userId: userId, documentsId: documentId}}
        ).then(data => {
            console.log(`200 PUT ${this.signs_url}/?userId=${userId};documentId=${userId}`)
            res.status(200).json(data);
        }).catch(err => {
            console.log(`500 PUT ${this.signs_url}/?userId=${userId};documentId=${userId}:\n${err}`);
            res.sendStatus(500);
        });
    }

    async getSigners(documentId, res){
        if(!documentId){
            console.log(`400 GET signers/?documentId=${documentId}`);
            return res.status(400).json(null);
        }

        await this.signatories_table.findAll({where: {documentId: documentId}}).then(data => {
            if(!data){
                console.log(`404 GET /signers/?documentId=${documentId}`);
                return res.status(404).json(null);
            }
            this.users_table.findAll({where: {id: data.map(sign => sign.userId)}}).then(users => {
                console.log(`200 GET /signers/?documentId=${documentId}`);
                res.status(200).json(users);
            });
        }).catch(err => {
            console.log(`500 GET /signers/?documentId=${documentId}:\n${err}`);
            res.sendStatus(500);
        });
    }
    
    async deleteSign(userId, documentId, res){
        await this.signatories_table.destroy({ where: {userId: userId, documentsId: documentId}}).then(() => 
            this.signatories_table.destroy({ where: { id: id }}).then(() => {
                console.log(`200 DELETE ${this.signs_url}/?userId=${userId};documentId=${userId}`);
                res.status(200).json(null);
            })
        ).catch(err => {
            console.log(`500 DELETE ${this.signs_url}/?userId=${userId};documentId=${userId}:\n${err}`);
            res.sendStatus(500);
        });
    }
}

module.exports.UsersAPI = UsersAPI;