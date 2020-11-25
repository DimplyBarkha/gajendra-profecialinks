const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'finishline',
    transform: transform,
    domain: 'finishline.com',
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

  await context.evaluate(async function () {
    console.log('inside evaluate');
    try {
      console.log('dataSku== try');
      await context.waitForSelector('div[id="reflektionList"] div[data-sku]', {}, { timeout: 100000 });
    } catch (error) {
      console.log('dataSku== error');
      console.log(error);
    }
  });

  return await context.extract(productDetails, { transform });
}
