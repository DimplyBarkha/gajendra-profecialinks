
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SK',
    store: 'mall',
    transform: null,
    domain: 'mall.sk',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {

    let cookieOkSel = 'div[id*="consent-panel"] button[class*="consent-panel"]';
    let cookieBtnPresent = false;
    try {
      await context.waitForSelector(cookieOkSel);
      cookieBtnPresent = true;
    } catch(err) {
      console.log('we got some error while waiting for cookie btn', err.message);
    }

    console.log('cookieBtnPresent', cookieBtnPresent);

    if(cookieBtnPresent) {
      try {
        await context.click(cookieOkSel);
      } catch(err) {
        console.log('got some error while clicking the cookie btn', err.message);
      }
    }

    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
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
      var name = getXpath('//span[@class="rating-percent"]/text()', 'nodeValue');
      if (name != null) {
        var agr = name.slice(0, -2);
        agr = (agr * 5) / 100;
        addElementToDocument('agr', agr);
      }
      var agg = getXpath('(//div[@class="pdrt__subtitle-info"]/a/img)[1]/@alt', 'nodeValue');
      if (agg != null) {
        addElementToDocument('agg', agg);
      } else {
        agg = getXpath('//article[@itemscope="itemscope"]/h1[@itemprop="name"]/text()', 'nodeValue');
        agg = agg.split(" ")[0];
        addElementToDocument('agg', agg);
      }
      var avl = getXpath('//div[@class="delivery-box"]/div[@class="pdra__status pdra__status--available"]/text()', 'nodeValue');
      if (avl != null) {
        avl = "In Stock"
        addElementToDocument('avl', avl);
      } else {
        avl = "Out Of Stock"
        addElementToDocument('avl', avl);
      }
      var mat = getXpath("//li[contains(text(), 'Materiál')]/text()", 'nodeValue');
      if (mat != null) {
        mat = mat.split(":")[1];
        addElementToDocument('mat', mat.trim());
      }
      var bull = getAllXpath('//div[@id="product-detail-description"]//ul/li/text()', 'nodeValue');
      if (bull != null) {
        var bullet = bull.join(" || ")
        addElementToDocument('bullet', bullet);
      }
      var script = getAllXpath('//div[@id="product-detail-description"]//ul/li/text()', 'nodeValue');
      var final = "";
      if (script.length >= 1) {
        for (var i = 0; i < script.length; i++) {
          final = final + script[i] + " || ";
        }
      } else {
        var script1 = getAllXpath('//div[@class="content-tabs"]//section[@class="panel-inner"]/p/text()', 'nodeValue');
        for (var i = 0; i < script1.length; i++) {
          final = final + script1[i];
        }
      }
      if (final.length >= 1) {
        addElementToDocument('descrip', final);
      }
      var image = getXpath("//div[@class='gallery__master-region']//div//div//div[1]//div//div[@class='gallery-magnifier gallery__slide gallery-magnifier--vertical-align']/img[1]/@src | (//img[@class='gallery-magnifier__normal']/@src)[1]", 'nodeValue');
      if (image.includes("550/550")) {
        image = image.replace("550/550", "");
        addElementToDocument('image', image);
      }
      var altimg = getAllXpath('//div[@class="gallery-thumbnails__inset"]/div/div/div[position()>1 ]/div/img/@src', 'nodeValue');
      if (altimg.length >= 1) {
        for (var i = 0; i < altimg.length; i++) {
          if (altimg[i].includes("550/550")) {
            altimg[i] = altimg[i].replace("550/550", "90/90");
          }
        }
        var secimg = altimg.join(" | ");
        addElementToDocument('secimg', secimg);
      }
      var ing = getAllXpath('//strong[contains(text(),"Zloženie:")]/parent::p/following::ul[1]/li/text() | //strong[contains(text(),"Ingrediencie:")]/parent::p/following::ul[1]/li/text()'
      , 'nodeValue');
      var final = "";
      if (ing.length>=1){
      for (var i = 0; i < ing.length; i++) {
        final = final +" "+ ing[i];
      }
      addElementToDocument('final', final);
      }
    });
    await context.extract(productDetails);
  },
};