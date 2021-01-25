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
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));

    await context.evaluate(async () => {
      const searchUrl = window.location.href;

      const products = document.querySelectorAll('section[class="product-list"] div[class*="product gtmProductClick w-100"]');

      products.forEach((product, index) => {
        product.setAttribute('searchurl', searchUrl);
        product.setAttribute('rank', `${index + 1}`);
        const prefix = 'https://www.e-bebek.com';
        const productUrl = product.querySelector('a.product-btn');
        if (productUrl !== null && productUrl !== undefined) product.setAttribute('producturl', prefix.concat(productUrl.getAttribute('href')));
        const id = product.querySelector('form[action*="wishlist"] > input');
        if (id !== null && id !== undefined) product.setAttribute('sku', id.getAttribute('value').toLowerCase());
        if (product.innerText.includes('Promosyonlu')) product.setAttribute('sponsored', 'true');
        if (!product.innerText.includes('Promosyonlu')) product.setAttribute('rankorganic', `${index + 1}`);
      });
    });

    return await context.extract(productDetails, { transform });
  },
};
