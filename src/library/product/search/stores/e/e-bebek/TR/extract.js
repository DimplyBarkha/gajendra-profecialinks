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
    const products = document.querySelectorAll('section[class="product-list"] div[class*="product gtmProductClick w-100"]');

    products.forEach((product, index) => {
      product.setAttribute('rank', `${index + 1}`);
      const prefix = 'https://www.e-bebek.com';
      const productUrl = product.querySelector('a.product-btn');
      if (productUrl !== undefined) product.setAttribute('producturl', prefix.concat(productUrl.getAttribute('href')));
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
