const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const seeMoreButton = await context.evaluate(() => {
    return !!document.querySelector('button[class*="sr-see-more"]');
  });
  if (seeMoreButton) {
    await context.click('button[class*="sr-see-more"]')
      .then(async () => {
        await new Promise((resolve, reject) => setTimeout(resolve, 5000));
      });
  }

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'cigaretteelec',
    transform,
    zipcode: '',
    domain: 'cigaretteelec.fr',
  },
  implementation,
};
