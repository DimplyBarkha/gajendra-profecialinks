const { transform } = require('../format');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector("a.c24-cookie-consent-button.io-cursor-add-CHFG");
    await context.click("a.c24-cookie-consent-button.io-cursor-add-CHFG");
  } catch (e) {
    console.log('No pop up');
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
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
  await new Promise(resolve => setTimeout(resolve, 6000));
  await applyScroll(context);
  await new Promise(resolve => setTimeout(resolve, 6000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'check24',
    transform: transform,
    domain: 'check24.de',
    zipcode: '',
  },
  implementation,
};