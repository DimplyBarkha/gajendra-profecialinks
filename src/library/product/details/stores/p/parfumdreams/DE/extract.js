
const { addAlias } = require("module-alias");
const { cleanUp } = require("../../../../shared");
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'parfumdreams',
    transform: cleanUp,
    domain: 'parfumdreams.de',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    const FinalURL = await context.evaluate(async () => {
      return window.location.href;
    });
    const videoURL = await context.evaluate(async () => {
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const url = getXpath('//div[@class="center mts2"]//a[@class="link-icon overlay cboxElement"]/@href', 'nodeValue');
      return url;
    });
    if (videoURL != null) {
      await context.goto('https://www.parfumdreams.de' + videoURL, { timeout: 20000, waitUntil: 'load', checkBlocked: false });
    }
    const videoxpath = await context.evaluate(async () => {
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      let xpathvideo = getXpath('//video[@class="vjs-tech"]/source[1]/@src', 'nodeValue');
      if (xpathvideo == null) {
        xpathvideo = 'empty';
      }
      return xpathvideo;
    });
    // if (videoURL != null) {
    await context.goto(FinalURL, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
    // }
    if (videoxpath != 'empty') {
      await context.evaluate((videoxpath) => {
        addHiddenDiv('video', videoxpath);
        function addHiddenDiv(id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
      }, videoxpath);
    }
    await context.evaluate(() => {
      function addElementToDocument(key, value, d) {
        const catElement = document.createElement("div");
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        //const neww = document.querySelectorAll(los);
        //neww(catElement, neww);
        document.body.appendChild(catElement);
      }
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("div[class*='font-headline description']")[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addHiddenDiv4(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("form[id='formVariatonPost'] div[id='schema-offer']")[index]
        //const originalDiv = document.querySelectorAll("//form[@id='formVariatonPost']/div[@id='schema-offer']")[index];
        originalDiv.appendChild(newDiv);
      }
      function addHiddenDiv5(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("form[action='/Shared/VariationPost']>div[class*='variation']")[index]
        //const originalDiv = document.querySelectorAll("//form[@id='formVariatonPost']/div[@id='schema-offer']")[index];
        originalDiv.appendChild(newDiv);
      }
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      //VARIANTS
      try {
        var dec = getAllXpath('(//div[@class="variation-alt-images clearfix"]/div/@data-variation-id | //*[@id="schema-offer"]/div[1]/div/input/@value)', 'nodeValue');
        var str = "";
        var frvar = dec[1]
        addElementToDocument('frvar', frvar);
        if (dec != null) {
          str = dec.join(" | ");
          addElementToDocument('str', str);
        }
      }
      catch (error) { }

      //AGGREGATE RATING
      try {
        var aggr = getXpath('//span[@itemprop="ratingValue"]/text()', 'nodeValue');
        if (aggr != null) {
          if (aggr.includes(",")) {
            addElementToDocument('aggr', aggr);
          } else {
            var nwaggr = aggr + ',0';
            addElementToDocument('aggr', nwaggr);
          }
          //addElementToDocument('name', name);
        }
      }
      catch (error) { }

      function appendData(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.getElementsByClassName('variants')[index].appendChild(newDiv);
      }
      function addEmptyDiv() {
        const newDiv = document.createElement('div');
        newDiv.className = 'variants';
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const allVariants = getAllXpath("//form[@id='formVariatonPost']/div[@id='schema-offer']|//form[@action='/Shared/VariationPost']/div[contains(@class,'variation')]", 'nodeValue');
      let arrAvailability = [], varprice = [], varpricePerUnit = [], varpriceUOM = [], varvariants = [], varlpr = [], varbrand = [], varnameex = [], varcolor = [], varvariantsids = [], varsku = [], vargtin = [], varmpc = [], varimgg = [];

      //AVAILABILITY
      try {
        var avail = getAllXpath('//div[@id="schema-offer"]/@data-outofstock | //form[@action="/Shared/VariationPost"]/@data-outofstock', 'nodeValue');
        for (var i = 0; i < avail.length; i++) {
          if (avail[i] == 'False') {
            arrAvailability.push('In Stock');
          }
          else {
            arrAvailability.push('Out of Stock');
          }
        }
      }
      catch (error) {
      }

      //PRICEPERUNIT
      try {
        var perunit = getAllXpath('//*[@id="schema-offer"]/div[2]/p[contains(text(),"GP")]/text()', 'nodeValue');
        for (let i = 0; i < perunit.length; i++) {
          if (perunit[i].trim().length > 1) {
            var priceper = perunit[i].split("/")[0].split('GP: ')[1];
            varpricePerUnit.push(priceper);
            var peruni2 = perunit[i].split("/")[1];
            varpriceUOM.push(peruni2);
          }
        }
      }
      catch (error) { }

      //PRICE
      try {
        var price = getAllXpath("//meta[@itemprop='price']/@content|//form/div/div[4]/p[1]/text()", 'nodeValue');
        for (var i = 0; i < price.length; i++) {
          var price1 = price[i].replace('.', ',').replace('€', '')
          varprice.push(price1 + ' €');
        }
      }
      catch (error) {
      }

      //PROD IMAGE
      // try {
      //   var imgg = getAllXpath('//*[@id="more-pictures-container"]/div/div/div/div/div[position() < last()]/div/img/@src', 'nodeValue');
      //   for (var i = 0; i < imgg.length; i++) {
      //     varimgg.push(imgg[i]);
      //   }

      // }
      // catch (error) { }

      //VARIANTSINFO
      try {
        var var1;
        var1 = getAllXpath('//*[@id="schema-offer"]/div[2]/p[1]/span/text()', 'nodeValue');
        if (var1.length == 0) {
          var1 = getAllXpath('//*[@id="variationsdropdown"]/ul/li/a/div/text()', 'nodeValue');
        }
        for (var i = 0; i < var1.length; i++) {
          varvariants.push(var1[i]);
        }
      }
      catch (error) {
      }

      //VARIANTSID
      try {
        var var1;
        var1 = getAllXpath('//div[@id="schema-offer"]/div[3]/meta[@itemprop="sku"]/@content', 'nodeValue');
        if (var1.length == 0) {
          var1 = getAllXpath('//*[@id="variationId"]/@value', 'nodeValue');
        }
        for (var i = 0; i < var1.length; i++) {
          varvariantsids.push(var1[i]);
        }
      }
      catch (error) {
      }

      //COLOR
      try {

        var var11 = getAllXpath('//*[@id="variationsdropdown"]/ul/li/a/div/text()', 'nodeValue');

        for (var i = 0; i < var11.length; i++) {
          var nzz = var11[i].split('/')[0];
          varcolor.push(nzz);
        }
      }
      catch (error) {
      }

      //LIST PRICE
      try {
        var lpr = document.querySelectorAll('div[id="schema-offer"] div:nth-of-type(3) div div');
        for (var i = 0; i < lpr.length; i++) {
          // @ts-ignore
          var aa = lpr[i].innerText;
          //'addHiddenDiv4('lpr', aa, i)
          varlpr.push(aa)
        }
      }
      catch (error) { }

      //DESCRIPTION
      try {
        // @ts-ignore
        var d2 = document.querySelector('div[class="footer-content"]> div:nth-child(1)').innerText
        if (d2 != null) {
          addElementToDocument('d2', d2)
        }
      }
      catch (error) { }


      //QUANTITY
      try {
        var qq = getAllXpath('//div[@id="schema-offer"]/div[2]/div/div[1]/div/text()', 'nodeValue');
        if (qq != null) {
          for (var i = 0; i < qq.length; i++) {
            addHiddenDiv('qty', qq[i], i)
          }
        }
      }
      catch (error) { }

      //NAME EXTENDED
      try {

        // @ts-ignore
        var name = document.querySelector('h1[class="article-header"]').innerText;
        //var name = getXpath('//*[@id="right-column"]/div/div[1]/div/div[2]/div[1]/div[1]/h1|(//h1)[2]', 'nodeValue');
        //*[@id="right-column"]/div/div[1]/div/div[2]/div[1]/div[1]/h1|(//h1)[2]
        if (name.trim != null) {
          // @ts-ignore
          for (var i = 0; i < varvariants.length; i++) {
            //addHiddenDiv4('desc', name + '- ' + varvariants[i], i)
            varnameex.push(name + '- ' + varvariants[i])
          }
        }
        else {
          var type2 = getAllXpath("//form/div/div[1]/img/@alt", 'nodeValue');
          for (var i = 0; i < varvariants.length; i++) {
            //addHiddenDiv5('desc', type2[i], i)
            varnameex.push(type2[i])
          }
        }
        //var type1 = getAllXpath('//*[@id="schema-offer"]/div[2]/p[1]/span/text()', 'nodeValue');


        // else{
        //   // @ts-ignore
        //   var name = document.querySelector('#right-column > div > div > div.cw.clearfix > div.c.d-7.p-l-6.p-m-12 > h1').innerText
        //   var type2 = getAllXpath("//form/div/div[1]/img/@alt", 'nodeValue');
        //   for (var i = 0; i < type2.length; i++) {
        //     //addHiddenDiv5('desc', type2[i], i)
        //     varnameex.push(type2[i])
        //   }
        // }
      }
      catch (error) {
        // var type2 = getAllXpath("//form/div/div[1]/img/@alt", 'nodeValue');
        // // @ts-ignore
        // //var name = document.querySelector('h1[class="article-header"]').innerText
        // if (type2.length >= 1) {
        //   // @ts-ignore
        //   for (var i = 0; i < type2.length; i++) {
        //     addHiddenDiv5('desc', type2[i], i)
        //   }
        // }
      }


      //URL
      try {
        var currurl = window.location.href
        addElementToDocument('currurl', currurl);

        //var gtin = currurl.split('index_')[1].split('.aspx')[0]

        //addElementToDocument('gtin', gtin);
      }
      catch (error) { }


      //GTIN
      try {
        var gtin13 = getAllXpath("//meta[@itemprop='gtin13']/@content", 'nodeValue');
        for (var i = 0; i < gtin13.length; i++) {
          vargtin.push(gtin13[i])
        }
      }
      catch (error) {

      }

      //MPC
      try {
        var mpc = getXpath("//div[@id='articlenumberDiv']/text()", 'nodeValue');
        var nwmpc = mpc.replace('Artnr. ', '')
        for (var i = 0; i < varvariants.length; i++) {
          varmpc.push(nwmpc)
        }
      }
      catch (error) {

      }

      //SKU
      try {
        var sku = getAllXpath('//div[@id="schema-offer"]/@data-runningnumber|//*[@id="articleId"]/@value', 'nodeValue');
        for (var i = 0; i < sku.length; i++) {
          if (sku[i].includes('.')) {
            var varnw = sku[i].split('.')[1]
            varsku.push(varnw)
          }
          else {
            var varnw = sku[i];
            varsku.push(varnw);
          }
        }


        // addElementToDocument('gtin', gtin);
      }
      catch (error) { }

      //IMAGECOUNT
      try {
        var imgcount = getAllXpath('//div[@class="carousel more-pictures"]/div[@class="swiper-wrapper"]/div[position()>1]/div/img/@src|//div[@class="slick-track"]/div[position()>1]/div/@data-image-m', 'nodeValue');
        addElementToDocument('imgcount', imgcount.length);
      }
      catch (error) { }

      //BRAND
      try {
        var brand = getXpath("//span[@itemprop='brand']|//h1[@class='hidden']/text()", 'nodeValue');
        //var price = getAllXpath("//meta[@itemprop='price']/@content", 'nodeValue');
        for (var i = 0; i < allVariants.length; i++) {
          addHiddenDiv4('brand', brand, i);
          varbrand.push(brand)
        }
      }
      catch (error) {
      }
      for (let j = 0; j < allVariants.length; j++) {
        addEmptyDiv();
        appendData('avail', arrAvailability[j], j);
        appendData('priceper', varpricePerUnit[j], j);
        appendData('perunit', varpriceUOM[j], j);
        appendData('price', varprice[j], j);
        appendData('varinfo', varvariants[j], j);
        appendData('lpr', varlpr[j], j);
        appendData('brand', varbrand[j], j);
        appendData('desc', varnameex[j], j);
        appendData('color', varcolor[j], j);
        appendData('varids', varvariantsids[j], j);
        appendData('varsku', varsku[j], j);
        appendData('vargtin', vargtin[j], j);
        appendData('varmpc', varmpc[j], j);
        appendData('varimgg', varimgg[j], j);


      }

    });
    await context.extract(productDetails);

  },

};