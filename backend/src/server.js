const express = require("express");
const db = require("./database");
const SETTINGS = require("../server.config").SETTINGS;

const app = express();
const jsonParser = express.json();

console.log("Server info: " + JSON.stringify(SETTINGS, null, 2))

db.sequelize.sync().then(result =>
    console.log("Connected to database.")
).catch(err => {
    console.log(err);
    return;
});

// Using CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
    next();  
});


// Templates' types routing

app.get("/templates_types", function(req, res){
    db.TemplateType.findAll({raw: true}).then(types => {
        console.log("200 GET /template_types")
        res.send(types)
    }).catch(err => {
        console.log(`500 GET /templates_types:\n${err}`);
        return res.sendStatus(500);
    });
});

app.post("/templates_types", jsonParser, async function(req, res){
    if(!req.body) {
        console.log('400 POST /templates')
        return res.sendStatus(400);
    }

    await db.TemplateType.create({}).then(data => {
        console.log('200 POST /templates_types');
        res.send(data)
    }).catch(err => {;
        console.log(`500 POST /templates_types:\n${err}`);
        res.sendStatus(500);
    });
});

app.delete("/templates_types/:id", async function(req, res){
    await db.TemplateType.destroy({
        where: { id: req.params.id }
    }).then(data => {
        console.log(`200 DELETE /templates_types/${req.params.id}`);
        res.status(200).json(data);
    }).catch(err => {
        console.log(`500 DELETE /templates_types/${req.params.id}:\n${err}`);
        res.sendStatus(500);
    });
});


// Templates routing

app.get("/templates", async function(req, res){
    await db.Template.findAll({raw: true}).then(data => {
        console.log("200 GET /templates");
        res.send(data);
    }).catch(err => {
        console.log(`500 GET /templates:\n${err}`);
        return res.sendStatus(500);
    });
});

app.get("/templates/:id", async function(req, res){
    await db.Template.findByPk(req.params.id).then(data => {
        if(data != undefined){
            console.log(`200 GET /templates/${req.params.id}`);
            res.json(data);
        } 
        else{
            console.log(`404 GET /templates/${req.params.id}`);
            res.sendStatus(404);
        }
    }).catch(err => {
        console.log(`500 GET /templates/${req.params.id}:\n${err}`);
        return res.sendStatus(500);
    });
});

app.post("/templates", jsonParser, async function(req, res){
    if(!req.body) {
        console.log('400 POST /templates')
        return res.sendStatus(400);
    }

    req.body.fields = JSON.stringify(req.body.fields);
    await db.Template.create({fields: req.body.fields ?? "[]", author: req.body.author, type: req.body.type}).then(data => {
        console.log(`200 POST /templates`)
        res.status(200).json(data);
    }).catch(err => {
        console.log(`500 POST /templates:\n${err}`);
        return res.sendStatus(500);
    });
});

app.put("/templates/:id", jsonParser, async function(req, res){
    if(!req.body) {
        console.log(`400 PUT /templates/${req.params.id}`)
        return res.sendStatus(400);
    }

    req.body.fields = JSON.stringify(req.body.fields);
    await db.Template.update(req.body, {
        where: { id: req.body.id }
    }).then(data => {
        if(data != undefined){
            console.log(`200 PUT /templates/${req.params.id}`);
            res.status(200).json(data);
        } 
        else{
            console.log(`404 PUT /templates/${req.params.id}`);
            res.sendStatus(404);
        }
    }).catch(err => {
        console.log(`500 PUT /templates/${req.params.id}:\n${err}`);
        return res.sendStatus(500);
    });
});

app.delete("/templates/:id", async function(req, res){
    await db.Template.destroy({
        where: { id: req.params.id }
    }).then(data => {
        console.log(`200 DELETE /templates/${req.params.id}`);
        res.status(200).json(data);
    }).catch(err => {
        console.log(`500 DELETE /templates/${req.params.id}:\n${err}`);
        return res.sendStatus(500);
    });
});


// Documents' infos routing

app.get("/documents", async function(req, res){
    await db.DocumentInfo.findAll({raw: true}).then(data => {
        console.log("200 GET /documents")
        res.status(200).json(data)
    }).catch(err => {
        console.log(`500 GET /documents:\n${err}`);
        return res.sendStatus(500);
    });
});

app.get("/documents/:id", async function(req, res){
    await db.DocumentInfo.findByPk(req.params.id).then(data => {
        if(data != undefined){
            console.log(`200 GET /documents/${req.params.id}`);
            res.json(data);
        } 
        else{
            console.log(`400 GET /documents/${req.params.id}`);
            res.sendStatus(404);
        }
    }).catch(err => {
        console.log(`500 GET /documents/${req.params.id}:\n${err}`);
        return res.sendStatus(500);
    });
});

app.post("/documents", jsonParser, async function(req, res){
    if(!req.body) {
        console.log('400 POST /documents')
        return res.sendStatus(400);
    }
    await db.DocumentInfo.create({templateId: req.body.templateId}).then(data => {
        console.log('200 POST /documents')
        res.status(200).json(data);
    }).catch(err => {
        console.log(`500 POST /documents:\n${err}`);
        return res.sendStatus(500);
    });
});

app.put("/documents/:id", jsonParser, async function(req, res){
    if(!req.body) {
        console.log('400 PUT /documents')
        return res.sendStatus(400);
    }

    await db.DocumentInfo.update(req.body, {
        where: { id: req.body.id }
    }).then(data => {
        if(data != undefined){
            console.log(`200 PUT /documents/${req.params.id}`);
            res.status(200).json(data);
        } 
        else{
            console.log(`400 PUT /documents/${req.params.id}`);
            res.sendStatus(404);
        }
    }).catch(err => {
        console.log(`500 PUT /documents/${req.params.id}:\n${err}`);
        return res.sendStatus(500);
    });
});

app.delete("/documents/:id", async function(req, res){
    await db.DocumentInfo.destroy({
        where: { id: req.params.id }
    }).then(data => {
        console.log(`200 DELETE /documents/${req.params.id}`);
        res.status(200).json(data);
    }).catch(err => {
        console.log(`500 DELETE /documents/${req.params.id}:\n${err}`);
        return res.sendStatus(500);
    });
});


// Documents' data routing

app.get("/documents_data/:id", async function(req, res){
    await db.DocumentData.findByPk(req.params.id).then(data => {
        if(data != undefined){
            console.log(`200 GET /documents_data/${req.params.id}`);
            res.json(data);
        } 
        else{
            console.log(`404 GET /documents_data/${req.params.id}`);
            res.sendStatus(404);
        }
    }).catch(err => {
        console.log(`500 GET /documents_data:\n${err}`);
        return res.sendStatus(500);
    });
});

app.post("/documents_data", jsonParser, async function(req, res){
    if(!req.body) {
        console.log('400 POST /documents_data')
        return res.sendStatus(400);
    }

    req.body.data = JSON.stringify(req.body.data);
    await db.DocumentData.create({id: req.body.id, data: req.body.data ?? "[]"}).then(data => {
        console.log('200 POST /documents_data')
        res.status(200).json(data);
    }).catch(err => {
        console.log(`500 POST /documents_data:\n${err}`);
        return res.sendStatus(500);
    });
});

app.put("/documents_data/:id", jsonParser, async function(req, res){
    if(!req.body) {
        console.log('400 PUT /documents_data')
        return res.sendStatus(400);
    }

    req.body.data = JSON.stringify(req.body.data);
    console.log(JSON.stringify(req.body, null, 2));
    await db.DocumentData.update(req.body, {
        where: { id: req.body.id }
    }).then(data => {
        if(data != undefined){
            console.log(`200 PUT /documents_data/${req.params.id}`);
            res.status(200).json(data);
        } 
        else{
            console.log(`404 PUT /documents_data/${req.params.id}`);
            res.sendStatus(404);
        }
    }).catch(err => {
        console.log(`500 PUT /documents_data/${req.params.id}:\n${err}`);
        return res.sendStatus(500);
    });
});

app.delete("/documents_data/:id", async function(req, res){
    await db.DocumentData.destroy({
        where: { id: req.params.id }
    }).then(data => {
        console.log(`200 DELETE /documents_data/${req.params.id}`)
        res.status(200).json(data);
    }
    ).catch(err => {
        console.log(`500 DELETE /documents_data/${req.params.id}:\n${err}`);
        return res.sendStatus(500);
    });
});


// Test route
app.get("/", async function(req, res){
    console.log(`200 GET /`)
    res.send("<h2>Server is working!</h2>")
});

app.listen(SETTINGS.host, () => console.log("Express server is runnig..."));