const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;


  await context.evaluate(async() => {
    function addProp(selector, iterator, propName, value) {
      document
        .querySelectorAll(selector)
        [iterator].setAttribute(propName, value);
    }
    const allProducts = document.querySelectorAll(
      'div.item'
    );
    for (let i = 0; i < allProducts.length; i++) {
      addProp(
        'div.item',
        i,
        'rankorganic',
        `${i + 1}`
      );
    }
  });

  await context.evaluate(async () => {
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    let scrollTop = 0;
    while (scrollTop !== 7000) {
      await stall(1000);
      scrollTop += 500;
      window.scroll(0, scrollTop);
      if (scrollTop === 7000) {
        await stall(1000);
        break;
      }
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'thewhiskyexchange',
    transform: null,
    domain: 'thewhiskyexchange.com',
    zipcode: '',
  },
  implementation
};
