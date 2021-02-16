
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
      let arrAvailability = [], varprice = [], varpricePerUnit = [], varpriceUOM = [], varvariants = [];

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
          var price1 = price[i].replace('.', ',')
          varprice.push(price1 + ' €');
        }
      }
      catch (error) {
      }

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
      
      //LIST PRICE
      try {
        var lpr = document.querySelectorAll('div[id="schema-offer"] div:nth-of-type(3) div div');
        for (var i = 0; i < lpr.length; i++) {
          // @ts-ignore
          var aa = lpr[i].innerText;
          addHiddenDiv4('lpr', aa, i)
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
        var type1 = getAllXpath('//*[@id="schema-offer"]/div[2]/p[1]/span/text()', 'nodeValue');
        // @ts-ignore
        var name = document.querySelector('h1[class="article-header"]').innerText
        if (type1 != null) {
          for (var i = 0; i < type1.length; i++) {
            addHiddenDiv4('desc', name + '- ' + type1[i], i)
          }
        }
      }
      catch (error) {
        var type2 = getAllXpath("//form/div/div[1]/img/@alt", 'nodeValue');
        // @ts-ignore
        //var name = document.querySelector('h1[class="article-header"]').innerText
        if (type2.length >= 1) {
          // @ts-ignore
          for (var i = 0; i < type2.length; i++) {
            addHiddenDiv5('desc', type2[i], i)
          }
        }
      }


      //URL
      try {
        var currurl = window.location.href
        addElementToDocument('currurl', currurl);
        var gtin = currurl.split('index_')[1].split('.aspx')[0]

        addElementToDocument('gtin', gtin);
      }
      catch (error) { }

      //AVAILABILITY
      try {
        var imgcount = getAllXpath('//div[@class="carousel more-pictures"]/div[@class="swiper-wrapper"]/div[position()>1]/div/img/@src|//div[@class="slick-track"]/div[position()>1]/div/@data-image-m', 'nodeValue');
        addElementToDocument('imgcount', imgcount.length);
      }
      catch (error) { }

      //BRAND
      try {
        var brand = getXpath("//span[@itemprop='brand']", 'nodeValue');
        var price = getAllXpath("//meta[@itemprop='price']/@content", 'nodeValue');
        for (var i = 0; i < price.length; i++) {
          addHiddenDiv4('brand', brand, i);
        }
      }
      catch (error) {
        var brand = getXpath("//h1[@class='hidden']/text()", 'nodeValue');
        var type2 = getAllXpath("//form/div/div[1]/img/@alt", 'nodeValue');
        if (type2.length >= 1) {
          // @ts-ignore
          for (var i = 0; i < type2.length; i++) {
            addHiddenDiv5('brand', brand, i)
          }
        }
      }
      for (let j = 0; j < allVariants.length; j++) {
        addEmptyDiv();
        appendData('avail', arrAvailability[j], j);
        appendData('priceper', varpricePerUnit[j], j);
        appendData('perunit', varpriceUOM[j], j);
        appendData('price', varprice[j], j);
        appendData('varinfo', varvariants[j], j);
      }

    });
    await context.extract(productDetails);

  },

};