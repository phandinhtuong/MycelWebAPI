'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var fs = require('fs');           // dùng để đọc SSL cert
var https = require('https');     // dùng để tạo https có sử dụng cert
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

  var domain = (false)?'localhost':'mycel.app';
  if (domain === 'localhost') {            //Only using localhost
    app.listen(port);
  } else {                //Only using with domain mycel.app
    // Declare cert files
    var options = {
      key  : fs.readFileSync('../cert/mycel.app-private-key.txt'),
      cert : fs.readFileSync('../cert/3eb041dc9e3c4cd8.crt')
    };
    // init the https listener with cert
    https.createServer(options, app).listen(port, function () {
      console.log('Server started @ %s!', port);
    });
  }

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://' + domain + ':' + port + '/hello?name=Scott');
    console.log('or api home page:\ncurl http://' + domain + ':'  + port + '/api-docs');
  }
});
