
const { cleanUp } = require('../../../../shared.js');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    transform: null,
    domain: 'flipkart.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    // await context.hover('div.sWIg8E');
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const ratingCountExists = document.evaluate("//span[@class='_38sUEc']//*[contains(text(), 'Reviews') or contains(text(), 'reviews')]", document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
      if (ratingCountExists) {
        const ratingCountString = document.evaluate("//span[@class='_38sUEc']//*[contains(text(), 'Reviews') or contains(text(), 'reviews')]", document, null, XPathResult.STRING_TYPE, null).stringValue;
        const ratingCountRegexp = /(\d+)\s+(Reviews|reviews)/g;
        const ratingCountMatch = ratingCountRegexp.exec(ratingCountString)[1];
        addElementToDocument('ratingCount', ratingCountMatch);
      }

      const jsonData = JSON.parse(document.getElementById('jsonLD').innerHTML);
      if ('brand' in jsonData[0]){
        const brandText = jsonData[0].brand.name;
        addElementToDocument('brandText', brandText);
      }

      const defaultVariantCount = 0;
      addElementToDocument('variantCount', defaultVariantCount);
    });
    await context.extract(productDetails);
  },
};
