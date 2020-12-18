const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'lacomer',
    transform: cleanUp,
    domain: 'lacomer.com.mx',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      // var Description = getAllXpath("//div[@class='product-detail__description-inner']/p[position()>1]/text()", 'nodeValue');
      // if (Description != null) {
      //   var ppp = Description.join(" || ")
      //   addElementToDocument('desc', ppp);
      // }

      var image = getAllXpath("//div[@class='item']/div[@class='mr-10']/a[@class='auxImagenZoom']/img[@class='text-center']/@src", 'nodeValue');
      if (image != null) {
        var qqq = image.join(" | ")
        addElementToDocument('img', qqq);
      }


    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
