//Original
// var mysql = require("mysql");
// var con = mysql.createConnection({
//   host: "103.130.216.98",
//   user: "vimoitru_excelDataUser",
//   password: "exceldatauser",
//   database: "vimoitru_excelData",
// });
// var sql = "select * from userData;";
// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");

//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Result: " + result);
//     res.json({ result: result });
//   });
//   con.end();
// });

"use strict";
module.exports = {
  excelDatabaseConnection: excelDatabaseConnection
};
function executeQuery(query, res) {
  var mysql = require("mysql");
  var con = mysql.createConnection({
    host: "103.130.216.98",
    user: "vimoitru_excelDataUser",
    password: "exceldatauser",
    database: "vimoitru_excelData",
  });
  con.connect(function (err) {
    if (err) {
      throw err;
    }
    console.log("Connected!");

    con.query(query, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
      res.json({ result: result });
    });
    con.end();
  });
}
function excelDatabaseConnection(req, res) {
  //arguments
  var op = req.swagger.params.op.value;
  var wbname = req.swagger.params.wbname.value;
  var author = req.swagger.params.author.value;
  var creationDate = req.swagger.params.creationdate.value;
  var lastAuthor = req.swagger.params.lastauthor.value;
  if (op == "insert"){
    executeQuery("INSERT INTO userData (`WBName`, `Author`, `CreationDate`, `LastAuthor`) SELECT * FROM (SELECT '"+wbname+"' as WBName, '"+author+"' as Author, '"+creationDate+"' as CreationDate, '"+lastAuthor+"' as LastAuthor) AS tmp WHERE NOT EXISTS (SELECT * FROM userData WHERE WBName = '"+wbname+"' AND Author = '"+author+"' AND CreationDate = '"+creationDate+"' AND LastAuthor = '"+lastAuthor+"');", res);
  }else if (op =="select"){
    executeQuery("select * from userData;", res);
  }else{
    res.json({result: 'Invalid operation'});
  }
  
}