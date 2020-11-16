const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    let scrollTop = 0;
    while (scrollTop !== 5000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 5000) {
        await stall(500);
        break;
      }
    }
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });

  await context.evaluate(async () => {
    const products = document.querySelectorAll('div.product-tile.product-has-data');
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
    country: 'SE',
    store: 'martinservera',
    transform: transform,
    domain: 'martinservera.se',
    zipcode: '',
  },
  implementation,
};
