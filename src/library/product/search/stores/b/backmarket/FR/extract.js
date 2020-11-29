const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    let scrollTop = 0;
    const scrollLimit = 10000;
    await stall(3000);
    while (scrollTop <= scrollLimit) {
      scrollTop += 1006;
      window.scroll(0, scrollTop);
      await stall(250);
    }
  });

  await context.evaluate(() => {
    function addProp (selector, iterator, name, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(name, value);
    }

    let i = 0;
    const productUrlSelector = document.querySelectorAll('a[data-test="product-thumb-link"]');
    let productUrl;

    productUrlSelector.forEach(url => {
      productUrl = url.href;

      addProp('a[data-test="product-thumb-link"]', i, 'producturl', productUrl);
      addProp('a[data-test="product-thumb-link"]', i, 'rank', `${i + 1}`);
      i++;
    });
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'backmarket',
    transform,
    domain: 'backmarket.fr',
    zipcode: "''",
  },
  implementation,
};
