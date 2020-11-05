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
      const rawdata = document.querySelectorAll('script[type="application/ld+json"]')[1].innerText;
      const jsondata = JSON.parse(rawdata);
      const gtin = jsondata.gtin13;
      const aggregateRating = jsondata.aggregateRating.ratingValue
      addElementToDocument('gtin', gtin);
      addElementToDocument('aggregateRating', aggregateRating);
      // @ts-ignore
      const sku = window.dataLayer[1].product.sku;
      addElementToDocument('sku', sku);
      // @ts-ignore
      const mpc = window.dataLayer[1].product_id;
      addElementToDocument('mpc', mpc);
      const directions = getXpath("//meta[@name=\"twitter:description\"]/@content", 'nodeValue');
      var directionsLength = directions.length;
      const finalDirections = directions.substr(directions.indexOf('To use'), directionsLength);
      addElementToDocument('directions', finalDirections);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
