
const { transform } = require('../../../../shared');

const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 40000) {
      const product = document.querySelectorAll('.df-card.product-container');
      console.log(product);
      if (product.length >= 150) break;
      const productsContainer = document.querySelector('.df-results');

      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      productsContainer && productsContainer.scroll(0, scrollTop);
      if (scrollTop === 40000) {
        await stall(500);
        break;
      }
    }
    function stall (ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });

  await context.evaluate(async function () {
    const productList = document.querySelectorAll('.df-card.product-container');
    const url = window.location.href;
    productList.forEach((product) => product.setAttribute('searchurl', url));
  });

  return await context.extract(productDetails, { transform });
};
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'keshop',
    transform,
    domain: 'keshop.com',
    zipcode: '',
  },
  implementation,
};
