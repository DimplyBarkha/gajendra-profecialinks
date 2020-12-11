const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function (context) {
    const isSelector = document.querySelector('button[class="coi-banner__accept"]');
    if (isSelector) {
      document.querySelector('button[class="coi-banner__accept').click();
    }
  });
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