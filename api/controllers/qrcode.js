"use strict";
module.exports = {
  qrcodeStringGenerator: qrcodeStringGenerator,
};
function qrcodeStringGenerator(req, res) {
  //QR Code library to generate base 64 string
  var QRCode = require("qrcode");

  //arguments
  var text = req.swagger.params.text.value;

  QRCode.toDataURL(text, function (err, url) {
    //console.log(url);
    if (err) console.error(err);
    res.json({ result: url });
  });
}
