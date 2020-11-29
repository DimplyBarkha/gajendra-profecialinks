const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const mainUrl = await context.evaluate(async function () {
    const button = document.querySelector('a.product-item-link');
    const link = button.getAttribute('href');
    return link;
  });
  await context.goto(mainUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
  await new Promise((resolve, reject) => setTimeout(resolve, 50000));
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 20000) {
      await stall(7000);
      scrollTop += 10000;
      window.scroll(0, scrollTop);
      if (scrollTop === 200000) {
        await stall(80000);
        break;
      }
    }
    function stall (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'ultrafarma',
    transform: transform,
    domain: 'ultrafarma.com.br',
    zipcode: "''",
  },
  implementation,
};
