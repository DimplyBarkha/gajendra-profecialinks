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