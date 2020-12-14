const { transform } = require('../../../../shared');

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
      while (scrollTop !== 20000) {
        await stall(5000);
        scrollTop += 1000;
        document.querySelector('section .ebx-scroll').scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(50000);
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
  // await context.waitForSelector('section[class="ebx-result-figure ebx-result__figure"] img', {}, { timeout: 50000 });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'dosfarma',
    transform: transform,
    domain: 'dosfarma.com',
    zipcode: '',
  },
  implementation,

};
