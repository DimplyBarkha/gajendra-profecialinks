const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  { transform: transformParam },
  context,
  dependencies,
) {
  // const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 30000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 30000) {
          await stall(6000);
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
    });
  };

  await applyScroll(context);
  return await context.extract(productDetails, { transform: transformParam });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'fetch',
    transform: transform,
    domain: 'fetch.co.uk',
    zipcode: '',
  },
  implementation,
};
