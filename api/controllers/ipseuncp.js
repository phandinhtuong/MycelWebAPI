"use strict";
module.exports = {
  ipseuncp: ipseuncp,
};
async function ipseuncp(req, res) {
  //library to crawl data
  const rp = require("request-promise");
  const cheerio = require("cheerio");

  //arguments
  var myOption = req.swagger.params.option.value.toUpperCase();
  var mySeq = req.swagger.params.seq.value.toUpperCase();

  var result;
  const options = {
    method:'POST',
    uri: "http://nguyenhongquang.edu.vn/result-iPseU-NCP",
    headers: {'Content-Type': 'application/x-www-form-urlencoded','Accept':'application/json, text/plain, */*'},
    body: 'options='+ myOption +'&seq=%3EP1%0D%0A' + mySeq
  };
  
  rp(options, (cerr,cres,cbody) => {
      if (cerr) {
        console.error(cerr);
        res.status(400);      
        // Gửi trực tiếp nội dung thô
        res.send(cerr.status);
        return;
      }
      // POST succeeded...
       //tự phân tích và trả về kết quả ở tham số $
      let $ = cheerio.load(cbody);

      
      let bio_content;      
      bio_content = $("#KQ").children('p').eq(4).html().replace(/\s/g, ''); // GCUAAACAGG<spanstyle="color:Tomato;">U</span>ACUGCUGGGC
      bio_content = bio_content.replace(/<spanstyle="color:Tomato;">/g,'+'); // Xóa thẻ mở span GCUAAACAGG_U</span>ACUGCUGGGC
      bio_content = bio_content.replace(/<spanstyle="color:Gray;">/g,'-'); // Xóa thẻ mở span GCUAAACAGG_U</span>ACUGCUGGGC
      bio_content = bio_content.replace(/<\/span>/g,''); // Xóa thẻ đóng span GCUAAACAGG_UACUGCUGGGC
      
      res.status(200);      
      // Gửi trực tiếp nội dung thô
      res.send(bio_content);
  });
}
