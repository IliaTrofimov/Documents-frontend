const APIObject = require("./api-object").APIObject;

class RegistryAPI extends APIObject{ 
    constructor(db_table){
        super(db_table, "/registry")
    }
}

module.exports.RegistryAPI = RegistryAPI;