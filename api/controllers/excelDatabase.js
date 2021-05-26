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
  excelDatabaseSelect: excelDatabaseSelect,
  excelDatabaseInsert: excelDatabaseInsert,
  loginUserSessionSelect: loginUserSessionSelect,
  loginUserSessionInsert: loginUserSessionInsert,
  register: register,
  login: login,
  socialAccountInsert: socialAccountInsert,
};
var globalHost = "103.130.216.98";
var globalUser = "vimoitru_excelDataUser";
var globalPassword = "exceldatauser";
var globalDatabase = "vimoitru_excelData";
var md5 = require("md5");
function executeQuery(query, res) {
  var mysql = require("mysql");
  var con = mysql.createConnection({
    host: globalHost,
    user: globalUser,
    password: globalPassword,
    database: globalDatabase,
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

function excelDatabaseSelect(req, res) {
  executeQuery("select * from userAndWbData;", res);
}
function excelDatabaseInsert(req, res) {
  var wbName = req.body.wbName;
  var wbAuthor = req.body.wbAuthor;
  var wbCreationDate = req.body.wbCreationDate;
  var wbLastAuthor = req.body.wbLastAuthor;
  var usedRangeJSON = req.body.usedRangeJSON;
  executeQuery(
    "INSERT INTO userAndWbData (`WBName`, `Author`, `CreationDate`, `LastAuthor`, `UsedRangeData`) SELECT * FROM (SELECT '" +
      wbName +
      "' as WBName, '" +
      wbAuthor +
      "' as Author, '" +
      wbCreationDate +
      "' as CreationDate, '" +
      wbLastAuthor +
      "' as LastAuthor, '" +
      usedRangeJSON +
      "' as UsedRangeData) AS tmp WHERE NOT EXISTS (SELECT * FROM userAndWbData WHERE WBName = '" +
      wbName +
      "' AND Author = '" +
      wbAuthor +
      "' AND CreationDate = '" +
      wbCreationDate +
      "' AND LastAuthor = '" +
      wbLastAuthor +
      "' AND UsedRangeData = '" +
      usedRangeJSON +
      "');",
    res
  );
}
function loginUserSessionSelect(req, res) {
  executeQuery("select * from loginUserSession;", res);
}
function loginUserSessionInsert(req, res) {
  var username = req.body.username;
  var socialUserId = req.body.socialUserId;

  executeQuery(
    "INSERT INTO loginUserSession (`social_id`, `username`) values ('" +
      socialUserId +
      "','" +
      username +
      "');",
    res
  );
}
function register(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  password = md5(password);
  var email = req.body.email;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  executeQuery(
    "insert into loginUser (`social_id`,`username`,`password`,`email`,`firstname`,`lastname`) select * from (select '0' as social_id, '" +
      username +
      "' as username, '" +
      password +
      "' as password, '" +
      email +
      "' as email, '" +
      firstname +
      "' as firstname, '" +
      lastname +
      "' as lastname) as tmp where not exists (select * from loginUser where username = '" +
      username +
      "');",
    res
  );
}
function socialAccountInsert(req, res) {
  var username = req.body.username;
  var socialUserId = req.body.socialUserId;
  var password = req.body.password;
  var email = req.body.email;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var picture = req.body.picture;
  var otherData = req.body.otherData;
  executeQuery(
    "insert into loginUser (`social_id`,`username`,`password`,`email`,`firstname`,`lastname`,`picture`,`other`) select * from (select '" +
      socialUserId +
      "' as social_id, '" +
      username +
      "' as username, '" +
      password +
      "' as password, '" +
      email +
      "' as email, '" +
      firstname +
      "' as firstname, '" +
      lastname +
      "' as lastname, '" +
      picture +
      "' as picture, '" +
      otherData +
      "' as other) as tmp where not exists (select * from loginUser where social_id = '" +
      socialUserId +
      "');",
    res
  );
}
function login(req, res) {
  var type = req.body.type;
  if (type == "normal") {
    var username = req.body.username;
    var password = req.body.password;
    password = md5(password);
    executeQuery(
      "SELECT * from loginUser where username = '" +
        username +
        "'and password = '" +
        password +
        "';",
      res
    );
  } else if (type == "social") {
    var socialUserId = req.body.socialUserId;
    // var otherData = req.body.otherData;
    //get other data and insert
    executeQuery(
      "SELECT * from loginUser where social_id = '" + socialUserId + "';",
      res
    );
  } else {
    res.json({ result: "Invalid type" });
  }
}
