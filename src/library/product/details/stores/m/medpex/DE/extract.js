const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    transform: cleanUp,
    domain: 'medpex.de',
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
      const size = getXpath('//h1[@itemprop="name"]/text()','nodeValue');
      var nameArr = size.split(',');
      addElementToDocument('size', nameArr[nameArr.length - 1])
      const price = getXpath('//div[@itemprop="offers"]/span[@class="normal-price"]//text()','nodeValue');
      var newprice=price.replace(",",".");
      addElementToDocument('price', newprice)
     try {
      const listprice = getXpath('(//div[@class="prices"]//span[@class="sp2p normal-price-crossedout"])[1]//text()','nodeValue');
      var newlistprice=listprice.replace(",",".");
      addElementToDocument('newlistprice', newlistprice)
     } catch (error) {
       
     }
     const brand = getXpath('//span[@class="productDetails-name"]//text()','nodeValue');
     var brand1=brand.split(" ");
      addElementToDocument('brand1', brand1[0])
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
