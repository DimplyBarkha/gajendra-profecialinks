const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  try {
    await context.waitForSelector('button[class="coi-banner__accept"]', { timeout: 10000 });
    await context.evaluate(function () {
      document.querySelector('button[class="coi-banner__accept"]').click();
    });
  } catch (err) {
    console.log('Accepting cookies failed');
  }

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'apopro',
    transform,
    domain: 'apopro.dk',
    zipcode: '',
  },
  implementation,
};
