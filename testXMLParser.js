async function crawlTyGiaVietcombank(){

    const rp = require("request-promise");
    const cheerio = require("cheerio");
    // const fs = require("fs");
    var resGlobal;
//   const URL = 'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx';
  const URL = 'https://portal.vietcombank.com.vn/UserControls/TVPortal.TyGia/pListTyGia.aspx?BacrhID=68&isEn=True&txttungay={0}';
  const options = {
    uri: URL,
    transform: function (body) {
      //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
      return cheerio.load(body,{xmlMode:true});
    },
  };
  //var res;
  await crawler();
  async function crawler() {
    try {
      // Lấy dữ liệu từ trang crawl đã được parseDOM
      var $ = await rp(options);
    } catch (error) {
      return error;
    }
    // resGlobal = $('[CurrencyCode=SGD]').attr('Buy'); //ok with no date

    for(var i = 2;i<22;i++){
        if ($('tbody').children('tr').eq(i).children('td[style="text-align:center;"]').text()==="CNY"){
            resGlobal = $('tbody').children('tr').eq(i).children('td').eq(3).text();
            console.log('assign: ',resGlobal);
            break;
        }
        // console.log($('tbody').children('tr').eq(4).children('td[style="text-align:center;"]').text());
    }
  };
  
  console.log('after func: ',resGlobal);
//   return res;
// return resGlobal;
}
crawlTyGiaVietcombank();