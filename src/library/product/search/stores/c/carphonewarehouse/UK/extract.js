const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  const { domain, country } = parameters;
  const { keywords } = inputs;
  await context.waitForSelector('div.banner-actions-container');
  await context.click('div.banner-actions-container');
  await context.waitForSelector('div.filterSearchResult');
  await context.evaluate(async (domain, country, keywords) => {

  }, domain, country, keywords);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'carphonewarehouse',
    transform: null,
    domain: 'carphonewarehouse.com',
    zipcode: '',
  },
  implementation
};
