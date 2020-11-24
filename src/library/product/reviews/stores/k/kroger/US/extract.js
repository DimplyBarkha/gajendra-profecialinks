const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;

  // await context.waitForXPath('//div[contains(@data-bv-show,"reviews") and not(@class="hidden")]', { timeout: 10000 })
  //   .catch(()=> console.log('No reviews for this item'))

  await context.evaluate(() => {

  });

  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'kroger',
    transform,
    domain: 'kroger.com',
    zipcode: '',
  },
  implementation,
};
