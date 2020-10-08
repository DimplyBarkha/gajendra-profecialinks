const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForSelector('div[product-card="product"] div');
  await context.evaluate(async function () {
    const getPriceWithCurrency = document.querySelectorAll('div[product-card="product"] span[itemprop="price"]');
    for (let i = 0; i < getPriceWithCurrency.length; i++) {
      let price = getPriceWithCurrency[i].getAttribute('content');
      console.log(price);
      price = price.replace('.', ',');
      price = '€ ' + price;
      getPriceWithCurrency[i].setAttribute('pricewithcurrency', price);
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'pixmania',
    transform: transform,
    domain: 'pixmania.es',
  },
  implementation,
};
