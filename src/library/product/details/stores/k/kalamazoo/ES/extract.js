const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const popUp = await context.evaluate(() => {
    return Boolean(document.querySelector('div[class*="main-content-container"]'));
  });
  if (popUp) {
    console.log('Pop Up box present');
  } else {
    console.log('No Pop Up box present');
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'kalamazoo',
    transform,
    domain: 'kalamazoo.es',
    zipcode: '',
  },
  implementation,
};
