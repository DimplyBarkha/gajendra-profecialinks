const { transform } = require('../format');

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
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
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
  await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  await context.setLoadAllResources()
  await applyScroll(context);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'wildberries',
    transform: transform,
    domain: 'wildberries.ru',
    zipcode: '',
  },
};
