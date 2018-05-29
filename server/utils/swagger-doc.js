module.exports = function (app) {
    const expressSwagger = require('express-swagger-generator')(app);

    let options = {
        swaggerDefinition: {
            info: {
                description: 'Blockpass demo service server',
                title: 'Swagger',
                version: '1.0.0',
            },
            host: 'localhost:3000',
            produces: [
                "application/json",
            ],
            schemes: ['http', 'https']
        },
        basedir: __dirname, //app absolute path
        files: ['../controllers/**/*.js'] //Path to the API handle folder
    };
    expressSwagger(options)
}