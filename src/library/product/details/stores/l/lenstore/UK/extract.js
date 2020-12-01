const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'allbeauty',
    transform: cleanUp,
    domain: 'allbeauty.com',
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
      // @ts-ignore
      const rawdata = getXpath("//p[@class='breadcrumb']/following::script[2]/text()",'nodeValue');
      const jsondata = JSON.parse(rawdata);
      const gtin = jsondata.gtin13;
      if (gtin != null){
        addElementToDocument('gtin', gtin);
      }
      
      const sku = jsondata.sku;
      if (sku != null){
      addElementToDocument('sku', sku);
      }

      const url = jsondata.url;
      if (url != null){
      addElementToDocument('url', url);
      }

      const productID = jsondata.productID;
      if (productID != null){
      addElementToDocument('id', productID);
      }

      const brand = jsondata.brand;
      if (brand != null){
      addElementToDocument('brand', brand);
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};