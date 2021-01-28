// @ts-nocheck
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'e-bebek',
    transform,
    domain: 'e-bebek.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));

    await context.evaluate(async () => {
      const searchUrl = window.location.href;

      const products = document.querySelectorAll('section[class="product-list"] div[class*="product gtmProductClick w-100"]');

      products.forEach((product, index) => {
        product.setAttribute('searchurl', searchUrl);
        product.setAttribute('rank', `${index + 1}`);
        const prefix = 'https://www.e-bebek.com';
        const productUrl = product.querySelector('a.product-btn');
        if (productUrl !== null && productUrl !== undefined) product.setAttribute('producturl', prefix.concat(productUrl.getAttribute('href')));
        // const id = product.querySelector('form[action*="wishlist"] > input');
        const id = product.querySelector('a')
          ? product.querySelector('a').getAttribute('href') : null;
        if (id !== null && id !== undefined) product.setAttribute('sku', id.split('-p-').pop().replace('/', ''));
        if (product.innerText.includes('Promosyonlu')) product.setAttribute('sponsored', 'true');
        if (!product.innerText.includes('Promosyonlu')) product.setAttribute('rankorganic', `${index + 1}`);
      });
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
