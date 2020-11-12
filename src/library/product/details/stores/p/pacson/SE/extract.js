const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'pacson',
    transform: cleanUp,
    domain: 'pacson.se',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      // Method to Retrieve Xpath content of a Multiple Nodes
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

      var price = getXpath('(//div[@class="product-detail__price-info"]/span[@class="price prio-30"])/text()', 'nodeValue');
      if (price != null){
        price = price.replace(",",".");
        addElementToDocument('price', price);
      }

      //mpc
      var mpc = getXpath("//div[contains(text(),'Artikelnummer')]/text()", 'nodeValue');
      if (mpc != null){
        mpc = mpc.split(": ")[1];
        addElementToDocument('mpc', mpc);
      }

      //description 
      var brand = getXpath("(//div[@class='product-detail__specification']/table/tbody/tr/th[1])[contains(text(),'Varumärke')]/following-sibling::th/text()", 'nodeValue');
      var desc = getXpath("//h1[@class='product-page__title']/span/text()", 'nodeValue');
      var desc2 = getXpath("(//h1[@class='product-page__title'])/text()[2]", 'nodeValue');
      if (desc2 != null){
        desc = desc + " " + desc2;
        if(brand != null) {
            desc = brand+"-"+desc;
        }
      }
      if(desc != null){
        addElementToDocument('desc', desc);
      }
      

    });
    await context.extract(productDetails);
  },
};