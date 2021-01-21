// @ts-nocheck
const { transform } = require('../../../../shared');
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addElementToDocument (id, value) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };
    const searchUrl = window.location.href;
    addElementToDocument('searchurl', searchUrl);
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    // waits for script loaded
    await stall(4000);
    const products = document.querySelectorAll('section[class="product-list"] div[class*="product gtmProductClick w-100"]');

    products.forEach((product, index) => {
      const prefix = 'https://www.e-bebek.com';
      const productUrl = product.querySelector('a.product-btn');
      if (productUrl !== null && productUrl !== undefined) product.setAttribute('producturl', prefix.concat(productUrl.getAttribute('href')));
      const id = product.querySelector('form[action*="wishlist"] > input');
      if (id !== null && id !== undefined) product.setAttribute('sku', id.getAttribute('value').toLowerCase());
      if (product.innerText.includes('Promosyonlu')) product.setAttribute('sponsored', 'true');
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'e-bebek',
    transform: transform,
    domain: 'e-bebek.com',
    zipcode: '',
  },
  implementation,
};
