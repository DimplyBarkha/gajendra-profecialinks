const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'lenstore_DE',
    transform: cleanUp,
    domain: 'www.lenstore.de',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
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
      var aval = getXpath('//span[@class="error u-error"]/text()', 'nodeValue');
      var lim = getXpath('//p[@id="limitedinfo"]/text()', 'nodeValue');
      if (aval != null) {
        var availability = "Out of Stock"
        addElementToDocument("availability", availability);
      } else if (lim != null) {
        var availability = "Limited availability"
        addElementToDocument("availability", availability);
      } else {
        var availability = "In Stock"
        addElementToDocument("availability", availability);
      }
      //descedit
      // var desc = getXpath('(//div[@class="clear"]/p/text())[1] | //div[@id="relatedShift"]/text()', 'nodeValue');
      // let str2 = desc
      // let regexp2 = /(.*)Produkt Details|(.*)Produktinformation|(.*)Produktdetails/;
      // let result2 = str2.match(regexp2)
      // addElementToDocument('desc', result2[1])
      var disc = getXpath('//div[@id="relatedShift"]/text()','nodeValue');
      if (disc != null) {
        if (disc.includes('Produkt Details')){
          var newdisc=disc.split("Produkt Details")
          var nn= newdisc[newdisc.length - 1]
          addElementToDocument("desc", nn);
        } else if (disc.includes('Produktinformation')){
          var newdisc=disc.split("Produktinformation")
          var nn= newdisc[newdisc.length - 1]
          addElementToDocument("desc", nn);
        } else {
          var newdisc=disc.split("Produktdetails")
          var nn= newdisc[newdisc.length - 1]
          addElementToDocument("desc", nn);
        }
      }
      //p[@id='limitedinfo']/text()
      // var dec = getXpath("//div[@id='productRight']/text()", 'nodeValue');
      // var str = "";
      // if (dec != null) {
      //   if (dec.includes("begrenzter")) {
      //     str = "Limited availability"
      //   } else {
      //     if (dec.includes("bis auf Weiteres eingestellt")) {
      //       str = "Out of Stock"
      //     } else {
      //       str = "In Stock"
      //     }
      //      addElementToDocument('str', str);
      //   }
      // }

      //availability
      var script = getXpath('//form[@class="js-add-to-basket-form"]/following::script[2]/text()', 'nodeValue');
      try {
        if (script != null) {
          var data = JSON.parse(script);
          try {
            var rate = data.aggregateRating.reviewCount;
            if (rate != null) {
              addElementToDocument('rate', rate);
            }
          }
          catch (error) {

          }
          try {
            var rate2 = data.aggregateRating.ratingValue;
            if (rate2 != null) {
              //var ratenew=rate2.toString
              //var rate3= rate2.replaceAll(".",",")
              addElementToDocument('rate2', rate2);
            }

          }
          catch (error) {

          }

          try {
            var gtin = data.gtin13;
            if (gtin != null) {
              addElementToDocument('gtin', gtin);
            }
          }
          catch (error) {

          }
          try {
            var sku = data.sku;
            if (sku != null) {
              addElementToDocument('sku', sku);
            }
          }
          catch (error) {

          }
          try {
            var url = data.url;
            if (url != null) {
              addElementToDocument('url', url);
            }
          }
          catch (error) {

          }
          try {
            var productID = data.productID;
            if (productID != null) {
              addElementToDocument('id', productID);
            }
          }
          catch (error) {

          }
          try {
            var brand = data.brand;
            if (brand != null) {
              addElementToDocument('brand', brand);
            }
          }
          catch (error) {

          }
          try {
            if (script != null) {
              var data1 = JSON.parse(script);
              var rpc = data.productID;
              if (rpc != null) {
                addElementToDocument('rpc', rpc);
              }
            }
          }
          catch (error) {

          }
        }
      }
      catch (error) {

      }

    });
    await context.extract(productDetails);
  },
};