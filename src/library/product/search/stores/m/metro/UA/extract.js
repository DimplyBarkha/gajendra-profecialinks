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
      product.setAttribute('search-url', window.location.href);
      product.setAttribute('product-url', prefix.concat(productUrl));
      product.setAttribute('product-id', product.querySelector('a.product-tile').getAttribute('data-productKey').replace('metro', ''));
      // @ts-ignore
      product.setAttribute('product-price', product.querySelector('div[data-marker="Discounted Price"] > span[class*=Price__value]')
        ? product.querySelector('div[data-marker="Discounted Price"] > span[class*=Price__value]').textContent.replace('.', ',') : '');
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
