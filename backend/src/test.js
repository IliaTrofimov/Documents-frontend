process.stdout.write('\033c');

const db = require("./database");

function str(object, spaces=2){
    return JSON.stringify(object, null, spaces)
}

db.sequelize.sync().then(function(r){
    console.log("Connected to database.");
    db.DocumentInfo.findByPk(3).then(info => {
        console.log("info: " + str(info));
        //console.log("functions: " + Object.getOwnPropertyNames(Object.getPrototypeOf(info)))
        info.getDocumentData().then(data => console.log("data: " + str(data)));
        info.getTemplate().then(temp => console.log("template: " + str(temp)));
    })
});

/*
DocumentInfo.hasOne(DocumentData); // fk in DocumentData
DocumentData.belongsTo(DocumentInfo);

Template.hasOne(DocumentInfo);
DocumentInfo.belongsTo(Template);

TemplateType.hasOne(Template);
Template.belongsTo(TemplateType);
*/
