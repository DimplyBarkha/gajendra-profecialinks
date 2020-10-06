
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
    await context.waitForSelector('button[id="btn-cookie-allow"]', { timeout: 10000 });
    await context.evaluate(function () {
      document.querySelector('button[id="btn-cookie-allow"]').click();
    });
  } catch (err) {
    console.log('Accepting cookies failed');
  }

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'elon',
    transform,
    domain: 'elon.se',
  },
  implementation,
};
