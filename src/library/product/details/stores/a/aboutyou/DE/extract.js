const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
  ) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  let isVariants = document.querySelector('[data-test-id="SingleSizeDropdownButton"]');
  if (isVariants) {
    isVariants.click();
  }
  return await context.extract(productDetails, { transform });
  }
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'aboutyou',
    transform,
    domain: 'aboutyou.de',
    zipcode: '',
  },
  implementation,
};
