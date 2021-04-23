'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

//gói giao diện web hiển thị api
const swaggerUi = require('swagger-ui-express');
//thư viện phân tích yaml
const YAML = require('yamljs');
//Xác định file manifest các web api của swagger
const swaggerDocument = YAML.load('./api/swagger/swagger.yaml');
// Thiết lập đường dẫn tới website xem api
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//Kích hoạt giao diện swagger express
app.use((req, res, next) => {
  console.log(req.url.match('^[^?]*')[0]);
  if (swaggerDocument.paths.hasOwnProperty(req.url.match('^[^?]*')[0])){ //check if the url pathname is in swagger doc
    console.log('True url, not redirecting: ');
  }else{
    console.log('False url, redirecting: '); // if not, redirect to api-docs
    res.redirect('/api-docs');
  }
  next();
});

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 64000;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
    console.log('or api home page:\ncurl http://127.0.0.1:' + port + '/api-docs');
  }
});
