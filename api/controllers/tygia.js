"use strict";
var util = require("util");
module.exports = {
  crawlTyGia: crawlTyGiaVietcombank,
};
async function crawlTyGiaVietcombank(req, res) {
  //library to crawl data
  const rp = require("request-promise");
  const cheerio = require("cheerio");

  //arguments
  var currency = req.swagger.params.currency.value;
  var type = req.swagger.params.type.value;
  var date = req.swagger.params.date.value;

  //type enum to get data with date in html
  var typeEnum;
  switch (type) {
    case "Buy":
      typeEnum = 2;
      break;
    case "Transfer":
      typeEnum = 3;
      break;
    case "Sell":
      typeEnum = 4;
      break;
  }
  var URL;

  if (date == "") {
    URL =
      "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx";
  } else {
    URL =
      "https://portal.vietcombank.com.vn/UserControls/TVPortal.TyGia/pListTyGia.aspx?BacrhID=68&isEn=True&txttungay=" +
      date;
  }
  var result;
  const options = {
    uri: URL,
    transform: function (body) {
      //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
      return cheerio.load(body, { xmlMode: true });
    },
  };
  await crawler();
  async function crawler() {
    try {
      // Lấy dữ liệu từ trang crawl đã được parseDOM
      var $ = await rp(options);
    } catch (error) {
      return error;
    }

    if (date == "") {
      //xml format
      result = $("[CurrencyCode=" + currency + "]").attr(type);
    } else {
      //html format
      for (var i = 2; i < 22; i++) {
        if (
          $("tbody")
            .children("tr")
            .eq(i)
            .children('td[style="text-align:center;"]')
            .text() === currency
        ) {
          result = $("tbody")
            .children("tr")
            .eq(i)
            .children("td")
            .eq(typeEnum)
            .text();
          break;
        }
      }
    }
  }
  res.json({ currency: currency, type: type, date: date, result: result });
}
