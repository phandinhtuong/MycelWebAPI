"use strict";

const { PassThrough } =  require('stream');
const { response } = require("express");

module.exports = {
  qrcodeStringGenerator: qrcodeStringGenerator,
};


function qrcodeStringGenerator(req, res) {
  //QR Code library to generate base 64 string
  var QRCode = require("qrcode");

  //arguments
  var text = req.swagger.params.text.value;
  var type = req.swagger.params.type.value;
  var size  = req.swagger.params.size.value;
  var color = req.swagger.params.color.value;
  var background = req.swagger.params.background.value;
  var margin = req.swagger.params.margin.value;
  var correction = req.swagger.params.correction.value;; // error_correction_level - correctionmissing, misread, or obscured data. Greater redundancy is achieved at the cost of being able to store less data. See the appendix for details. Here are the supported values:
                                            // L - [Default] Allows recovery of up to 7% data loss
                                            // M - Allows recovery of up to 15% data loss
                                            // Q - Allows recovery of up to 25% data loss
                                            // H - Allows recovery of up to 30% data loss

  if (type !== 'png') {
    QRCode.toDataURL(text, function (err, url) {
      //console.log(url);
      if (err) console.error(err);
      res.json({ result: url });
    });
  } else {
    //res.sendFile(`E:/workspaces/OfficeAddin/DinhTuong/MycelWebAPI/api/assets/icon-64.png`);
    const qrStream = new PassThrough();
    const result =  QRCode.toFileStream(qrStream,text,{
                                                                type: 'png',
                                                                color: {
                                                                  dark: color,
                                                                  light: background
                                                                },
                                                                width: size,
                                                                errorCorrectionLevel: correction,
                                                                margin:margin
                                                            }
                                            );
    res.setHeader("Content-Type", "image/png");
    qrStream.pipe(res);
  };  
}
