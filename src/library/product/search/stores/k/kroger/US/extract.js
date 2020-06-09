async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  async function getElementsOnPage () {
    return await context.evaluate(() => {
      return document.getElementsByClassName('kds-Text--m text-default-800 mt-12 mb-4 font-500').length;
    });
  }

  const currentElCount = await getElementsOnPage();

  const totalElCount = currentElCount;

  return await context.extract(productDetails, { transform });
}

const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform: transform,
    domain: 'kroger.com',
  },
  implementation,
};
