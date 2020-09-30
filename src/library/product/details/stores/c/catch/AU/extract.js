const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'catch',
    transform,
    domain: 'catch.com.au',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    console.log('abcd test');
    await context.evaluate(async function () {

      function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      const packagingElem = document.createElement('div');

      packagingElem.id = 'specifications';
      packagingElem.prepend(getElementByXpath("//*[contains(text(),'Specifications')]/following::ul[1]"));

      document.body.append(packagingElem);
    })

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
