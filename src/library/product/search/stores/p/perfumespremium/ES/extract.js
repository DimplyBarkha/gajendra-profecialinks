const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    for (let i = 0; i <= document.body.scrollHeight; i = i + 500) {
      window.scrollBy({ top: i, left: 0, behavior: 'smooth' });
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);

    const products = document.querySelectorAll('div.product-item-info');
    products.forEach((product, index) => {
      // set rank
      product.setAttribute('rank', (index + 1).toString());
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'perfumespremium',
    transform: transform,
    domain: 'perfumespremium.es',
    zipcode: '',
  },
  implementation,
};
