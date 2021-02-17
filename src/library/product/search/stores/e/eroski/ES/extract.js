const { transform } = require('../shared');
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
      while (scrollTop !== 22000) {
        console.log("scrollTop:::::: ", scrollTop);
        await stall(5000);
        scrollTop += 3000;
        window.scroll(0, scrollTop);
        if (scrollTop === 24000) {
          await stall(2000);
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
    country: 'ES',
    store: 'eroski',
    transform: transform,
    domain: 'supermercado.eroski.es',
    zipcode: '',
  },
  implementation,
};
