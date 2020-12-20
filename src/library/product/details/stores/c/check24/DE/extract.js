const { transform } = require('../format');
async function implementation (
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
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 12000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 12000) {
          await stall(500);
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
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('.variations__tiles .variations__container a')) ? document.querySelectorAll('.variations__tiles .variations__container a').length : 0;
  });
  if (variantLength > 1) {
    // await preparePageForCommonElement(0, variantLength);
    for (let j = 0; j < variantLength; j++) {
      await context.evaluate(async (j) => {
        return document.querySelectorAll('.variations__tiles .variations__container a')[j].click();
      }, j);
      await new Promise(resolve => setTimeout(resolve, 10000));
      await applyScroll(context);
      await new Promise(resolve => setTimeout(resolve, 3000));
      await context.evaluate(async function () {
        const video = document.querySelector('div.product-video-content.js-youtube');
        if (video) {
          video.click();
        }
      });
      console.log('Inside variants', j);
      // await preparePage(j, variantLength);
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
    }
  }
  // await new Promise(resolve => setTimeout(resolve, 6000));
  // await applyScroll(context);
  // await new Promise(resolve => setTimeout(resolve, 6000));
  // await context.evaluate(async function () {
  //   const video = document.querySelector('div.product-video-content.js-youtube');
  //   if (video) {
  //     video.click();
  //   }
  // });
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
