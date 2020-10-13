const { transform } = require('../shared');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const pageUrl = await context.evaluate(function () {
    return window.location.href;
  });
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;

      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };


  await context.setBlockAds(false);
  // going back to product page
  await context.goto(pageUrl, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
  await applyScroll(context);

  return context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'betta',
    transform,
    domain: 'betta.com.au'
  },
  implementation
};
