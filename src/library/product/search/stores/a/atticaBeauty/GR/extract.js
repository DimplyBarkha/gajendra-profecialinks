const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const mainUrl = await context.evaluate(async function () {
    return document.URL;
  });
  await context.goto(mainUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
  console.log('mainUrl', mainUrl);
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 20000) {
      await stall(700);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(8000);
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
  implements: 'product/search/extract',
  parameterValues: {
    country: 'GR',
    store: 'atticaBeauty',
    transform: transform,
    domain: 'atticadps.gr',
    zipcode: "''",
  },
  implementation,
};
