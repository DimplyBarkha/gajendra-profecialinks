
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'lloydspharmacy',
    transform: null,
    domain: 'lloydspharmacy.com',
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

      //desc
      var abc = getAllXpath('//div[@class="rte"]/p/text()', 'nodeValue');
      if(abc != null){
        var desc = abc.join(" ");
        addElementToDocument('desc', desc);
      }

      //bullet info 
      var de = getAllXpath("//h3[contains(text(),'Features of')]/following::ul[1]/li/text()", 'nodeValue');
      if(de != null){
        var bullet = de.join(" || ");
        addElementToDocument('bullet', bullet);
      }

      //warning
      var wa = getAllXpath("//h4[contains(text(),'Warnings and cautions')]/following::div[1]/div/ul/li/text() | //h4[contains(text(),'Warnings and cautions')]/following::div[1]/div/text()", 'nodeValue');
      if(wa != null){
        var warning = wa.join(" , ");
        addElementToDocument('warning', warning);
      }

      // sku
      var script = getXpath('(//head//script[@type="application/ld+json"])[1]/text()', 'nodeValue');
      if(script != null){
        var data = JSON.parse(script);
        var sku = data.sku;
        if(sku != null){
          addElementToDocument('sku', sku);
        }
      }

      //brand
      if(script != null){
        var brand = data.brand.name;
        if(brand != null){
          addElementToDocument('brand', brand);
        }
      }


    });
    await context.extract(productDetails);
  },
};