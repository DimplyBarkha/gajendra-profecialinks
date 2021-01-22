/* eslint-disable no-unmodified-loop-condition */
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.ca',
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
  await context.evaluate(async () => {
    while (!document.querySelector('button[class*="loadMore"]') && !document.querySelector('div[class*="endOfList"]')) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (document.querySelector('div[class*="endOfList"]')) {
        break;
      }
      // @ts-ignore
      document.querySelector('button[class*="loadMore"]').click();
    }
    window.scrollTo(0, document.querySelector('div[class*="endOfList"]').offsetTop);
  });
  return await context.extract(productDetails, { transform });
}
