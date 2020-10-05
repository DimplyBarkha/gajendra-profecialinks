const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    if (document.querySelector('li#brand_navigation_item > a')) {
      document.querySelector('li#brand_navigation_item > a').click();
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'darty',
    transform,
    domain: 'darty.com',
    zipcode: '',
  },
  implementation,
};
