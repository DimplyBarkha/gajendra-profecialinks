const { transform } = require('../format');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // try {
  // await context.waitForSelector("a[class='c24-cookie-consent-button io-cursor-add-CHFG']");
  // await context.click("a[class='c24-cookie-consent-button io-cursor-add-CHFG']");
  // } catch (e) {
  // console.log('No pop up');
  // }
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1000);
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
  await context.evaluate(async function () {
    const video = document.querySelector('div.product-video-content.js-youtube');
    if (video) {
      video.click();
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'check24',
    transform: transform,
    domain: 'check24.de',
    zipcode: '',
  },
  implementation,
};