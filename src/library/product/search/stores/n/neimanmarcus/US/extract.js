const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.click('dd#HundredTwentyPerPage a', { timeout: 3000 })
    .then(async () => await new Promise((resolve, reject) => setTimeout(resolve, 7000)))
    .catch(() => console.log('View button not applicable'));

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'neimanmarcus',
    transform,
    zipcode: '',
    domain: 'neimanmarcus.com',
  },
  implementation,
};
