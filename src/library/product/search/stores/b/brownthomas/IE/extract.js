
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const detailsPageSelector = 'h1[itemprop="name"]';

  const isSelectorAvailable = async (detailsPageSelector) => {
    console.log(`Is selector available: ${detailsPageSelector}`);
    return await context.evaluate(function (detailsPageSelector) {
      return !!document.querySelector(detailsPageSelector);
    }, detailsPageSelector);
  };

  console.log('.....waiting......');

  const xpathAvailable = await isSelectorAvailable(detailsPageSelector);
  if (xpathAvailable) {
    console.log('Redirected to details page');
    throw new Error('ERROR: Loaded details page');
  }
  return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'target',
    transform,
    domain: 'target.com',
  },
  implementation,
};
