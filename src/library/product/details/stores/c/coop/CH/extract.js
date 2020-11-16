const { transform } = require('../shared')
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("inputs:: ", inputs);
  const {url, id } = inputs;
  console.log("parameters:: ", parameters);
  if(id){
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  await context.waitForXPath('//div[@class="productTile__wrapper"]/a');

  await context.waitForSelector('div.productTile__wrapper a');
  console.log('everything fine !!!');
  await context.evaluate(() => {
    const firstItem = document.querySelector('div.productTile__wrapper a');
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
    store: 'coop',
    transform: transform,
    domain: 'coop.ch',
    zipcode: "''",
  },
  implementation,
};
