const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve) => setTimeout(resolve, 1500));
  await context.evaluate(() => {
    const curentUrl = window.location.href;
    const searchUrl = curentUrl.match(/(.*)?&page/) ? curentUrl.match(/(.*)?&page/)[1] : curentUrl;
    const allProducts = document.querySelectorAll('li.product');
    allProducts.forEach((product, index) => {
      const productUrl = `https://sbermarket.ru${product.querySelector('a.product__link').getAttribute('href')}`;
      const photoUrlPart = product.querySelector('div.product__img > img').getAttribute('data-src');
      const photoUrl = `https://sbermarket.ru${photoUrlPart}`;
      product.setAttribute('product-url', productUrl);
      product.setAttribute('search-url', searchUrl);
      if (photoUrlPart) product.setAttribute('product-photo', photoUrl);
    });
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'sbermarket',
    transform: transform,
    domain: 'sbermarket.ru/metro',
    zipcode: "''",
  },
  implementation,
};
