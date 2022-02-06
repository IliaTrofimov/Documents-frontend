const Sequelize = require("sequelize");
const SETTINGS = require("../server.config").SETTINGS

const sequelize = new Sequelize({
    dialect: SETTINGS.sql_dialect,
    storage: SETTINGS.sql_connection,
    logging: SETTINGS.db_logging,
    define: {timestamps: false}
});


const TemplateType = sequelize.define("template_types", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },   
});

const Template = sequelize.define("template", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING(300),
        defaultValue: "новый шаблон"
    },
    author: {
        type: Sequelize.INTEGER,
        allowNull: true
    },   
    fields: {
        type: Sequelize.TEXT,
        defaultValue: "[]",
    },
    type: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    depricated:{
        type: Sequelize.INTEGER,
        defaultValue: 0,
    }, 
    updateDate: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
    }
});

const DocumentInfo = sequelize.define("documents_infos", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING(300),
        defaultValue: "новый документ"
    },
    author: {
        type: Sequelize.INTEGER,
        allowNull: true
    },   
    type: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    updateDate: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW,
    },
    expireDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
});

const DocumentData = sequelize.define("documents_data", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    data: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
    },   
});

const Registry = sequelize.define("registry", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(300)
    },  
    owner: {
        type: Sequelize.STRING(300)
    }, 
    org_units: {
        type: Sequelize.STRING(300)
    }, 
    b_criticality: {
        type: Sequelize.INTEGER
    }, 
    lifecycle: {
        type: Sequelize.STRING(300)
    },
    b_portfolio: {
        type: Sequelize.STRING(300)
    },
    it_portfolio: {
        type: Sequelize.STRING(300)
    },
    gxp_relevant: {
        type: Sequelize.INTEGER
    },
});

const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(300)
    }
});

const Signatories = sequelize.define('signatories', {
    documentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: DocumentInfo, 
          key: 'id'
        },
      },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: User, 
        key: 'id'
      }
    },
    signed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    }
  });


// FK_documentData_documentInfo
DocumentInfo.hasOne(DocumentData, {
    foreignKey: 'id',
    as: 'DocumentData'
});
DocumentData.belongsTo(DocumentInfo, {
    foreignKey: 'id'
});

// FK_documentInfo_registry
Registry.hasMany(DocumentInfo);
DocumentInfo.belongsTo(Registry, {
    foreignKey: 'registryId'
});

// FK_documentInfo_users
User.hasMany(DocumentInfo);
DocumentInfo.belongsTo(User, {
    foreignKey: 'author'
});

// FK_signatories (many-to-many)
User.belongsToMany(DocumentInfo, { through: Signatories });
DocumentInfo.belongsToMany(User, { through: Signatories, foreignKey: "documentId" });

// FK_template_users
User.hasMany(Template);
Template.belongsTo(User, {
    foreignKey: 'author'
});

// FK_documentInfo_template
Template.hasMany(DocumentInfo);
DocumentInfo.belongsTo(Template, {
    foreignKey: 'templateId'
});


// TODO: FK_template_templateType



module.exports.sequelize = sequelize;
module.exports.DocumentData = DocumentData;
module.exports.DocumentInfo = DocumentInfo;
module.exports.Template = Template;
module.exports.TemplateType = TemplateType;
module.exports.Registry = Registry;
module.exports.User = User;
module.exports.Signatories = Signatories;