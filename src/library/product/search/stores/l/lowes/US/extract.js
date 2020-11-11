const { cleanUp } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 30000) {
        await stall(5000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 30000) {
          await stall(5000);
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
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    transform: cleanUp,
    domain: 'lowes.com',
    zipcode: '',
  },
  implementation,
};
