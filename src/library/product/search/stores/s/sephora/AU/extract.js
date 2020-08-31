const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'sephora',
    transform,
    domain: 'sephora.com.au',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(function () {
    document.cookie = 'locale=au;';
  });

  await new Promise(resolve => setTimeout(resolve, 5000));

  return await context.extract(productDetails, { transform });
}
