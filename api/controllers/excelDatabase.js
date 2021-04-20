"use strict";
module.exports = {
  excelDatabaseConnection: excelDatabaseConnection,
};
function excelDatabaseConnection(req, res) {
  var mysql = require("mysql");
  var con = mysql.createConnection({
    host: "103.130.216.98",
    user: "vimoitru_excelDataUser",
    password: "exceldatauser",
    database: "vimoitru_excelData",
  });
  var sql = "select * from userData;";
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
      res.json({ result: result });
    });
    con.end();
  });
}
