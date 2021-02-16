/* eslint-disable no-shadow */
const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  await context.evaluate(() => {
    document.querySelector('div[analytics-tag="product list"]').setAttribute('url', document.location.href);
  });

  return await context.extract(productDetails, { transform }, 'MERGE_ROWS');
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    transform,
    domain: 'jumbo.com',
    zipcode: '',
  },
  implementation,
};
