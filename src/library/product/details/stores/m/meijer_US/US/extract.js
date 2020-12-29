const {cleanUp} = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer',
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
      const size = getXpath("//div[@class='lsection mobile-product-name h6']//text()", 'nodeValue');
      try {
        if (size != null) {
          //var nameArr = size.split(',');
          let str = size
          //nameArr[nameArr.length - 1]
          let regexp = /((\d+ oz)|(\d+.\d+ lbs)|(\d+ lbs)|(\d+ Pack)|(\d+.\d+ oz)|(\d+oz)|(\d+.\d+oz)|(\d+ct)|(\d+ ct))/;
          let result = str.match(regexp)
          addElementToDocument('size', result[1] + '')
        }
        else {
          addElementToDocument('size', '1')
        }
      }
      catch (error) {

      }
      try {
        const brandText = getXpath("//meta[@itemprop='brand']/@content", 'nodeValue');
      let str2 = brandText
      let regexp2 = /((La Preferida)|(Fresh Step)|(Swiss Miss)|(^\w+-\w+)|(^\w+))/;
      let result2 = str2.match(regexp2)
      addElementToDocument('brandText', result2[1] + '')
      const price = getXpath("//div[@class='display-price']//span[@itemprop='price']/text() | (//div[@class='display-price sale-price']/text())[1]", 'nodeValue');
      if (price.includes('$')) {
        addElementToDocument('price', price);
      }
      else {
        addElementToDocument('price', '$' + price);
      }
      }
      catch(error){
        
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};