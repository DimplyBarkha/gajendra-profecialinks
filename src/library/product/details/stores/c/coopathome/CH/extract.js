const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log('inputs:: ', inputs);
  const { url, id } = inputs;
  console.log('parameters:: ', parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.waitForXPath('//div[@class="product-listing__thumbnail-image"]/img');

    await context.waitForSelector('div.product-listing__thumbnail-image img');
    console.log('everything fine !!!');
    await context.evaluate(() => {
      const firstItem = document.querySelector('div.product-listing__thumbnail-image img');
      firstItem.click();
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'coopathome',
    transform: transform,
    domain: 'coop.ch',
    zipcode: '',
  },
  implementation,
};
