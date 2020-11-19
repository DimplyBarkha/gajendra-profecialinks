const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await context.evaluate(() => {
    const allProducts = document.querySelectorAll('div.products-box__list-item');
    const prefix = 'https://metro.zakaz.ua';
    allProducts.forEach((product) => {
      const productUrl = product.querySelector('a.product-tile').getAttribute('href');
      product.setAttribute('product-url', prefix.concat(productUrl));
    });
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UA',
    store: 'metro',
    transform: transform,
    domain: 'metro.ua',
    zipcode: '',
  },
  implementation,
};
