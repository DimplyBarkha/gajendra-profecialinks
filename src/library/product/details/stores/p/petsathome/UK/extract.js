const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'petsathome',
    transform,
    domain: 'petsathome.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const finalArray = [];
      function removeHeader(text) {
        if (text) {
          return text.split(':')[1].trim();
        } else {
          return '';
        }
      }
      function getElementsByXPath(xpath, parent) {
        const results = [];
        const query = document.evaluate(xpath, parent || document,
          null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
          const node = query.snapshotItem(i) && query.snapshotItem(i).textContent && query.snapshotItem(i).textContent.trim();
          results.push(node);
        }
        return results.filter(e => e);
      }
      const dataArr = getElementsByXPath('//div[@id="pdp-accordion__description"]/text() | //div[@id="pdp-accordion__nutrition"]/text()');
      var ingredient = removeHeader(dataArr && dataArr.find(e => e.includes('Ingredients')));
      var direction = removeHeader(dataArr.find(e => e.includes('Feeding Guide')));
      var dimensions = removeHeader(dataArr.find(e => e.includes('Approximate Dimensions')));
      document.querySelector('h1').setAttribute('ingredient', ingredient);
      document.querySelector('h1').setAttribute('direction', direction);
      document.querySelector('h1').setAttribute('dimensions', dimensions);

    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
