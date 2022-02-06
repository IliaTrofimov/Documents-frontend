const express = require("express");
const db = require("./database");
const SETTINGS = require("../server.config").SETTINGS;

const { TemplatesAPI, TemplateTypesAPI } = require("./api-objects/templates-api");
const { DocumentsDataAPI, DocumentsInfoAPI } = require("./api-objects/documents-api");
const { APIObject } = require("./api-objects/api-object");
const { UsersAPI, SignsAPI } = require("./api-objects/users-api");
const JoinedDocumentAPI = require("./api-objects/joinedDoc-api").JoinedDocument;

const templatesAPI = new TemplatesAPI(db.Template);
const templateTypesAPI = new TemplateTypesAPI(db.TemplateType);
const documentsDataAPI = new DocumentsDataAPI(db.DocumentData);
const documentsInfoAPI = new DocumentsInfoAPI(db.DocumentInfo);
const joinedDocumentAPI = new JoinedDocumentAPI(db.DocumentData, db.DocumentInfo, db.Template);
const registryAPI = new APIObject(db.Registry, "/registry");
const usersAPI = new UsersAPI(db.User, db.Signatories, "/users", "/signs");

const app = express();
const jsonParser = express.json();

db.sequelize.sync().then(result => {
    console.log("Connected to database.");
}
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
app.get("/templates_types", async function(req, res){
   await templateTypesAPI.getAll(res);
});

app.post("/templates_types", jsonParser, async function(req, res){
    await templateTypesAPI.post(req.body.name, res);
});

app.delete("/templates_types/:id", async function(req, res){
    await templateTypesAPI.delete(req.params.id, res);
});


// Templates routing
app.get("/templates", jsonParser, async function(req, res){
    await templatesAPI.getAll(res);
});

app.get("/templates/:id", async function(req, res){
    await templatesAPI.getOne(req.params.id, res);
});

app.post("/templates", jsonParser, async function(req, res){
    req.body.fields = JSON.stringify(req.body.fields);
    await templatesAPI.post(req.body, res);
});

app.put("/templates/:id", jsonParser, async function(req, res){
    req.body.fields = JSON.stringify(req.body.fields);
    await templatesAPI.put(req.body, res);
});

app.delete("/templates/:id", async function(req, res){
    let doc = await db.DocumentInfo.findOne({where: {templateId: req.params.id}});
    if(!doc){
        await templatesAPI.delete(req.params.id, res);
    }
    else{
        console.log(`409 DELETE template/${req.params.id} (is still in use)`)
        res.status(409).send("Cannot delete template, some documents are still using it.");
    }
});


// Documents' infos routing
app.get("/documents", async function(req, res){
    await documentsInfoAPI.getAll(res);
});

app.get("/documents/:id", async function(req, res){
    await documentsInfoAPI.getOne(req.params.id, res);
});

app.put("/documents/:id", jsonParser, async function(req, res){
    await documentsInfoAPI.put(req.body, res);
});


// Documents' data routing
app.get("/documents_data", async function(req, res){
    await documentsDataAPI.getAll(res);
});

app.get("/documents_data/:id", async function(req, res){
    await documentsDataAPI.getOne(req.params.id, res);
});

app.put("/documents_data/:id", jsonParser, async function(req, res){
    req.body.data = JSON.stringify(req.body.data);
    await documentsDataAPI.put(req.body, res);
});


// Routes for joined-documents requests (to edit document's data & info at the same time)
app.get("/document_joined/:id",  async function(req, res){
    await joinedDocumentAPI.get(req.params.id, res);
})

app.delete("/document_joined/:id",  async function(req, res){
    await joinedDocumentAPI.delete(req.params.id, res); 
})

app.put("/document_joined/:id", jsonParser, async function(req, res){
    req.body.data.data = JSON.stringify(req.body.data.data);
    await joinedDocumentAPI.put(req.body.info, req.body.data, res); 
})

app.post("/document_joined/", jsonParser, async function(req, res){
    if(req.body.previousVerionId)
        await joinedDocumentAPI.post(req.body.templateId, res, req.body.previousVerionId); 
    else
        await joinedDocumentAPI.post(req.body.templateId, res); 
})


// Users routing
app.get("/users/:id", async function(req, res){
    await usersAPI.getOne(req.params.id, res);
});

app.get("/users/", async function(req, res){
    await usersAPI.search(req.query.name, res);
});


// Signs routing
app.get("/signs/", jsonParser, async function(req, res){
    await usersAPI.getOne(req.body.userId, req.body.documentsInfoID, res);
});

app.get("/signers/:id", async function(req, res){
    await usersAPI.getSigners(req.params.id, res);
});

app.post("/signs/", jsonParser, async function(req, res){
    await usersAPI.post(req.body.userId, req.body.documentsInfoID, res);
});

app.put("/signs/", jsonParser, async function(req, res){
    await usersAPI.put(req.body.userId, req.body.documentsID, req.body.signed, res);
});

app.delete("/signs/", jsonParser, async function(req, res){
    await usersAPI.delete(req.body.userId, req.body.documentsID, res);
});


// Test route
app.get("/", async function(req, res){
    let info = JSON.stringify(SETTINGS, null, 2);

    console.log(`200 GET / (info page)`);
    res.status(200).send(`
        <h2>Server is working!</h2>
        <code>
            <span><b>Server info</b>: <pre>${info}</pre></span><br>
            <b>Stats</b><br>
            'DocumentData' items: ${await db.DocumentData.count()}<br>
            'DocumentInfo' items: ${await db.DocumentInfo.count()}<br>
            'Template' items: ${await db.Template.count()}<br>
            'TemplateType' items: ${await db.TemplateType.count()}<br>
            'User' items: ${await db.User.count()}<br>
            'Signatories' items: ${await db.Signatories.count()}<br>
            'Registry' items: ${await db.Registry.count()}<br>
        </code>
    `);
});



app.listen(SETTINGS.host, () => {
    if (SETTINGS.flush_console) 
        process.stdout.write('\033c');
        
    console.log("Server info: " + JSON.stringify(SETTINGS, null, 2));
    console.log("Express server is runnig.");
});