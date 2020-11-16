const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log('inputs --  core extract:: ', inputs);
  const { id } = inputs;
  console.log('parameters --- core extract:: ', parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.waitForXPath('//h5[@class="product-name"]/a');

    // await context.waitForSelector('div.productBlock a');
    console.log('everything fine !!!');
    await context.evaluate(() => {
      const firstItem = document.querySelector('h5.product-name a');
      if (firstItem) firstItem.click();
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'EE',
    store: 'selver',
    transform: transform,
    domain: 'selver.ee',
    zipcode: '',
  },
  implementation,
};
