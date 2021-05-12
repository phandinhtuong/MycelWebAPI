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
  loginUserSelect: loginUserSelect,
  loginUserInsert: loginUserInsert,
  register: register,
  login: login,
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
function loginUserSelect(req, res) {
  executeQuery("select * from loginUserSession;", res);
}
function loginUserInsert(req, res) {
  var data = req.body.data;
  executeQuery(
    "INSERT INTO loginUserSession (`UserData`) SELECT * FROM (SELECT '" +
      data +
      "' as UserData) AS tmp WHERE NOT EXISTS (SELECT * FROM loginUserSession WHERE UserData = '" +
      data +
      "');",
    res
  );
}
function register(req, res) {
  var type = req.body.type;
  if (type == "normal") {
    var username = req.body.username;
    var password = req.body.password;
    password = md5(password);
    var email = req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    executeQuery(
      "insert into loginUserNormal (`user_id`,`username`,`password`,`email`,`firstname`,`lastname`) select * from (select '0' as user_id, '" +
        username +
        "' as username, '" +
        password +
        "' as password, '" +
        email +
        "' as email, '" +
        firstname +
        "' as firstname, '" +
        lastname +
        "' as lastname) as tmp where not exists (select * from loginUserNormal where username = '" +
        username +
        "');",
      res
    );
  } else if (type == "social") {
    var username = req.body.username;
    var password = req.body.password;
    password = md5(password);
    var email = req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var socialUserId = req.body.socialUserId;
    var otherData = req.body.otherData;
    // res.json({ username: username, password: password, otherData: otherData });

    executeQuery(
      "select insertUserOrReturnExisted('" +
        socialUserId +
        "','" +
        username +
        "','" +
        password +
        "','" +
        email +
        "','" +
        firstname +
        "','" +
        lastname +
        "','" +
        otherData +
        "') as result;",
      res
    );
  } else if (type == "checkSocialAccount") {
    var socialUserId = req.body.socialUserId;
    executeQuery(
      "SELECT * FROM `loginUserNormal` WHERE user_id = '" + socialUserId + "';",
      res
    );
  } else {
    res.json({ result: "Invalid type" });
  }
}
function login(req, res) {
  var type = req.body.type;
  if (type == "normal") {
    var username = req.body.username;
    var password = req.body.password;
    password = md5(password);
    executeQuery(
      "SELECT username,email,firstname,lastname,social_data from loginUserNormal INNER JOIN loginUserSocial on loginUserNormal.user_id = loginUserSocial.user_id where username = '" +
        username +
        "'and password = '" +
        password +
        "';",
      res
    );
  } else if (type == "social") {
    var socialUserId = req.body.socialUserId;
    executeQuery(
      "SELECT username,email,firstname,lastname,social_data from loginUserNormal INNER JOIN loginUserSocial on loginUserNormal.user_id = loginUserSocial.user_id where loginUserNormal.user_id = '" +
        socialUserId +
        "';",
      res
    );
  } else {
    res.json({ result: "Invalid type" });
  }
}
