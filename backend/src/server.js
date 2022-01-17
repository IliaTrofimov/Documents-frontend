const express = require("express");
const db = require("./database");
const SETTINGS = require("../server.config").SETTINGS;

const { TemplatesAPI, TemplateTypesAPI } = require("./api-objects/templates-api");
const { DocumentsDataAPI, DocumentsInfoAPI } = require("./api-objects/documents-api");
const templatesAPI = new TemplatesAPI(db.Template);
const templateTypesAPI = new TemplateTypesAPI(db.TemplateType);
const documentsDataAPI = new DocumentsDataAPI(db.DocumentData);
const documentsInfoAPI = new DocumentsInfoAPI(db.DocumentInfo);

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
app.get("/templates", async function(req, res){
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
    await templatesAPI.delete(req.params.id, res);
});


// Documents' infos routing
app.get("/documents", async function(req, res){
    await documentsInfoAPI.getAll(res);
});

app.get("/documents/:id", async function(req, res){
    await documentsInfoAPI.getOne(req.params.id, res);
});

app.post("/documents", jsonParser, async function(req, res){
    await documentsInfoAPI.post(req.body, res);
});

app.put("/documents/:id", jsonParser, async function(req, res){
    await documentsInfoAPI.put(req.body, res);
});

app.delete("/documents/:id", async function(req, res){
    await documentsInfoAPI.delete(req.params.id, res);
});


// Documents' data routing
app.get("/documents_data", async function(req, res){
    await documentsDataAPI.getAll(res);
});

app.get("/documents_data/:id", async function(req, res){
    await documentsDataAPI.getOne(req.params.id, res);
});

app.post("/documents_data", jsonParser, async function(req, res){
    req.body.data = JSON.stringify(req.body.data);
    await documentsDataAPI.post(req.body, res);
});

app.put("/documents_data/:id", jsonParser, async function(req, res){
    req.body.data = JSON.stringify(req.body.data);
    await documentsDataAPI.put(req.body, res);
});

app.delete("/documents_data/:id", async function(req, res){
    await documentsDataAPI.delete(req.params.id, res);
});


// Using associations to get three items joined in one response
app.get("/document-joined/:id",  async function(req, res){
    let merged = {
        info: null,
        data: null,
        template: null
    }
    await db.DocumentInfo.findByPk(req.params.id).then(info => {
        if(info == undefined){
            res.status(404).json(info);
            console.log(`404 GET /document-joined/${req.params.id}`);
            return;
        }
        merged.info = info;

        info.getDocumentData().then(data => {
            if(data == undefined){
                res.status(404).json(data);
                console.log(`404 GET /document-joined/${req.params.id}`);
                return;
            }
            merged.data = data;

            info.getTemplate().then(temp => {
                if(temp == undefined){
                    res.status(404).json(temp);
                    console.log(`404 GET /document-joined/${req.params.id}`);
                    return;
                }
                merged.template = temp;
                console.log(`200 GET /document-joined/${req.params.id}`);
                res.status(200).json(merged);
            });
        });
    }).catch(err => {
        console.log(`500 GET /document-joined/${req.params.id}:\n${err}`);
        res.sendStatus(500);
    })
})


// Test route
app.get("/", async function(req, res){
    let info = JSON.stringify(SETTINGS, null, '<br>&nbsp;&nbsp;');
    let dataCount = await db.DocumentData.count();
    let infoCount = await db.DocumentInfo.count();
    let templateCount = await db.Template.count();
    let typeCount = await db.TemplateType.count();

    console.log(`200 GET /`);
    res.status(200).send(`
        <h2>Server is working!</h2>
        <code>
            <b>Server info</b>: ${info}<br><br>
            <b>Stats</b><br>
            'DocumentData' items: ${dataCount}<br>
            'DocumentInfo' items: ${infoCount}<br>
            'Template' items: ${templateCount}<br>
            'TemplateType' items: ${typeCount}<br>
        </code>
    `);
});


app.listen(SETTINGS.host, () => {
    if (SETTINGS.flush_console) 
        process.stdout.write('\033c');
        
    console.log("Server info: " + JSON.stringify(SETTINGS, null, 2));
    console.log("Express server is runnig.");
});