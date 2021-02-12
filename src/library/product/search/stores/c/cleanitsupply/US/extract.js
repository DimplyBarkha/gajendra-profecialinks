const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise(resolve => setTimeout(resolve, 4000));
  await context.evaluate(async function () {
    const overlay = document.querySelector('div.bx-slab div.bx-wrap div.bx-row-submit-custom button.bx-button[data-click="close"]');
    if (overlay) {
      overlay.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'cleanitsupply',
    transform: transform,
    domain: 'cleanitsupply.com',
    zipcode: '',
  },
  implementation,
};
