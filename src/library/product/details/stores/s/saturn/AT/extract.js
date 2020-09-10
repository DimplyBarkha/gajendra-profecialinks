const { transform } = require('./transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const moreSpecsSelector = '[class="button button-toggle-collapsed js-toggle-collapsed"]';
  const moreSpecs = await context.evaluate((selector) => !!document.querySelector(selector), moreSpecsSelector);
  if (moreSpecs) {
    await context.click(moreSpecsSelector);
    await context.waitForNavigation({ waitUntil: 'load' });
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'saturn',
    transform,
    domain: 'saturn.at',
    zipcode: '',
  },
  implementation,
};
