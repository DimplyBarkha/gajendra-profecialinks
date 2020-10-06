const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    document.body.setAttribute('current-page', window.location.href);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'argos',
    transform,
    domain: 'argos.ie',
    zipcode: '',
  },
  implementation,
};
