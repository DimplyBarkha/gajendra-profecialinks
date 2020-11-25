const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 5000) {
      await stall(1000);
      scrollTop += 500;
      window.scroll(0, scrollTop);
      if (scrollTop === 5000) {
        await stall(1000);
        break;
      }
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    function stall (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    transform: transform,
    domain: 'euro.com.pl',
    zipcode: '',
  },
  implementation,
};