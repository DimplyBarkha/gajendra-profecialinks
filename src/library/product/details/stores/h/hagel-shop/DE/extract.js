module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'hagel-shop',
    transform: null,
    domain: 'hagel-shop.de',
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

      var vari = getAllXpath('//div[@class="simple-product-list"]//td/a[@class="product-name"]/strong/text()', 'nodeValue');
      if (vari != null) {
        var variants = vari.join(" | ");
        addElementToDocument('variants', variants);
      }

      var agg = getXpath('//div[@class="col-sm-7"]//div[@class="rating-box"]/div/@style', 'nodeValue');
      if (agg != null) {
        var aggregate = agg.split(":")[1].slice(0, -1);
        aggregate = (aggregate * 5) / 100;
        addElementToDocument('aggregate', aggregate);
      }

      //specifications
      var spec = getAllXpath('//div[@id="product_attributes"]/table/tbody/tr/th/text()', 'nodeValue');
      var spec2 = getAllXpath('//div[@id="product_attributes"]/table/tbody/tr/td/text()', 'nodeValue');
      if(spec != null){
        var specifications = "";
        for(var i=0; i<spec.length; i++){
            specifications = specifications + spec[i]+spec2[i];
            var j = i+1;
            if(j < spec.length){
              specifications = specifications + " || ";
            }
        }
        // var specifications = spec.join(" || ");
        addElementToDocument('specifications', specifications);
      }


    });
    await context.extract(productDetails);
  },
};
