const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    const searchUrl = window.location.href;
    document.querySelector('body').setAttribute('searchurl', searchUrl);
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage',
    transform: transform,
    domain: 'staplesadvantage.com',
    zipcode: '',
  },
  implementation,
};
