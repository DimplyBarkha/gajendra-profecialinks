const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer_49684',
    transform: cleanUp,
    domain: 'meijer.com',
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
      try {
        const size = getXpath("//div[@class='lsection mobile-product-name h6']//text()", 'nodeValue');
        var nameArr = size.split(',');
        addElementToDocument('size', nameArr[nameArr.length - 1])
        const price = getXpath("//div[@class='display-price']//span[@itemprop='price']/text() | (//div[@class='display-price sale-price']/text())[1]", 'nodeValue');
        if (price.includes('$')) {
          addElementToDocument('price', price);
        }
        else {
          addElementToDocument('price', '$' + price);
        }
      } catch (error) {

      }
      try {
        var stock = "In Stock"
        const availability = getXpath('//h2[@itemprop="availability"]/text()', 'nodeValue');
        if (availability.includes("In Stock")) {
          addElementToDocument('stock', stock);
          console.log(stock)
        }
        else {
          stock = "Out Of Stock"
          console.log(stock)
          addElementToDocument('availability', stock);
        }
      } catch (error) {

      }

    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
