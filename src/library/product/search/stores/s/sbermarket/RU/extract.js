const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    const allProducts = document.querySelectorAll('li.product');
    allProducts.forEach((product, index) => {
      const productUrl = `https://sbermarket.ru${product.querySelector('a.product__link').getAttribute('href')}`;
      const photoUrl = `https://sbermarket.ru${product.querySelector('div.product__img > img').getAttribute('src')}`;
      product.setAttribute('product-url', productUrl);
      product.setAttribute('product-photo', photoUrl);
      product.setAttribute('rank', `${index + 1}`);
    });
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'sbermarket',
    transform: null,
    domain: 'sbermarket.ru/metro',
    zipcode: "''",
  },
  implementation,
};
