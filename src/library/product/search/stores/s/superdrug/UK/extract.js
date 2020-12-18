const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    let scrollTop = 0;
    while (scrollTop !== 5000) {
      await stall(1000);
      scrollTop += 500;
      window.scroll(0, scrollTop);
      if (scrollTop === 5000) {
        await stall(1000);
        break;
      }
    }
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    const searchUrl = window.location.href;
    addElementToDocument('url', searchUrl);

    const products = document.querySelectorAll('ul.plp__product-container li');
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
    country: 'UK',
    store: 'superdrug',
    transform: transform,
    domain: 'superdrug.com',
    zipcode: '',
  },
  implementation,
};
