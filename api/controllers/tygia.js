"use strict";
module.exports = {
  crawlTyGia: crawlTyGiaVietcombank,
};
async function crawlTyGiaVietcombank(req, res) {
  //library to crawl data
  const rp = require("request-promise");
  const cheerio = require("cheerio");

  //arguments
  var currency = req.swagger.params.currency.value.toUpperCase();
  var type = req.swagger.params.type.value.toLowerCase();
  var date = req.swagger.params.date.value;
  /// Thời điểm lấy tỷ giá (chỉ có nếu truy cập tại thời điểm hiện tại)
  var currenttime = null;
  if ((typeof(date)  === 'undefined' )||(date == "")) {
    date = null;
  }

  //type enum to get data with date in html
  var typeEnum;
  switch (type) {
    case "buy":
    case "mua":    
      typeEnum = 2;
      type='Buy';         // Theo qui định trong format html
      break;
    case "transfer":
    case "chuyển khoản":    
      typeEnum = 3;
      type='Transfer';    // Theo qui định trong format html      
      break;
    case "sell":
    case "bán":  
      typeEnum = 4;
      type='Sell';        // Theo qui định trong format html      
      break;
    default:
      res.status(422);
      res.json({ error: "Type " + type + " is invalid" });
      return;
  }
  var URL;

  if (date === null) {
    URL = "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx";
  } else {
    var dateWithSlash = date.slice(0,2) + "/" + date.slice(2,4) + "/" +date.slice(4,8);
    URL = "https://portal.vietcombank.com.vn/UserControls/TVPortal.TyGia/pListTyGia.aspx?BacrhID=68&isEn=True"
    URL =  URL + "&txttungay=" + dateWithSlash;
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

    if (date === null) {
      /*  
      <ExrateList>
      <DateTime>4/21/2021 8:30:37 AM</DateTime>
      <Exrate CurrencyCode="AUD" CurrencyName="AUSTRALIAN DOLLAR " Buy="17,479.94" Transfer="17,656.51" Sell="18,210.04"/>
      <Exrate CurrencyCode="CAD" CurrencyName="CANADIAN DOLLAR " Buy="17,972.66" Transfer="18,154.20" Sell="18,723.34"/>
      <Exrate CurrencyCode="USD" CurrencyName="US DOLLAR " Buy="22,960.00" Transfer="22,990.00" Sell="23,170.00"/>
      <Source>Joint Stock Commercial Bank for Foreign Trade of Vietnam - Vietcombank</Source>
      </ExrateList>
      */
      result = $("[CurrencyCode=" + currency + "]").attr(type);
            // xác định thời điểm hiện tại  
            var today = new Date();  
            date =  today.getDate().toString().padStart(2,'0')  + (today.getMonth()+1).toString().padStart(2,'0') + today.getFullYear();      
            currenttime =  today.getHours().toString().padStart(2,'0')  + today.getMinutes().toString().padStart(2,'0') + today.getSeconds().toString().padStart(2,'0');
    } else {
      //html format
      /* <table>
        <tbody>
            <tr class="classth fontS-11">
                <th colspan="2">Currency</th>
                <th colspan="2">Buying Rates
                </th>
            </tr>
            <tr class="classth fontS-11">
                <th style="width:25%;">Currency Name</th>
                <th>
                    Currency Code
                </th>
            </tr>          
            <tr class="odd" data-time="4/21/2021 8:30:04 AM">
                <td style="text-align:left;" > AUSTRALIAN DOLLAR   </td>
                <td style="text-align:center;">AUD</td>
                <td>17,479.94 </td>
                <td>17,656.51</td>
                <td>18,210.04</td>
            </tr>
      */      
      for (var i = 2; i < 22; i++) { // Table có 22 dòng với 2 dòng tiêu đề và 20 dòng của 20 ngoại tệ
        if (                         // Tìm tới thẻ /tbody/tr[..]/td[..] phù hợp 
          $("tbody")                 
            .children("tr")
            .eq(i)
            .children('td[style="text-align:center;"]')
            .text() === currency
        ) {                         // .. và lấy ra giá trị ở thẻ  /tbody/tr[..]/td[..] phù hợp 
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
    if (result != "-") {
    } else {
        res.status(400);
        res.json({ error: "Data not found" });
        return;
    }
  }
  // res.json({ currency: currency, type: type, date: date, result: result });
  res.json({ result: result, type: type, date: date, time: currenttime });
}
