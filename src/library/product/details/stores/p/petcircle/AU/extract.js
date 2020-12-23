const { transform } = require('../AU/format')
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("inputs:: ", inputs);
  const { url, id } = inputs;
  console.log("parameters:: ", parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.waitForXPath('//h3[@class="product-name"]/a/@href');
    await context.waitForSelector('h3.product-name a');
    console.log('everything fine !!!');
    await context.evaluate(() => {
      let firstItem = document.querySelector('h3.product-name a');
      if (firstItem instanceof HTMLElement) {
        console.log(firstItem)
        firstItem.click();
      }
    });
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'petcircle',
    transform,
    domain: 'petcircle.com.au',
    zipcode: '',
  },
  implementation,
};