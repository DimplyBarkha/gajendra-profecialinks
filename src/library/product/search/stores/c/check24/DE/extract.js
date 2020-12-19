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
    await context.evaluate(async () => {
      try {
        if (document.querySelector('.c24-cookie-consent-button')) {
          // document.querySelector('.c24-cookie-consent-button').click();
          // await new Promise(resolve => setTimeout(resolve, 2000));
          document.querySelector('.c24-cookie-consent-screen a:last-child.c24-cookie-consent-button').click();
        }
        return;
      } catch (error) {
        console.log('No pop up');
      }
    });
  } catch (e) {
    console.log('Error while closing popup');
  }
  // await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 15000) {
        await stall(1000);
        scrollTop += 500;
        window.scroll(0, scrollTop);
        if (scrollTop === 15000) {
          await stall(2000);
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
  //await new Promise(resolve => setTimeout(resolve, 6000));
  await applyScroll(context);
  //await new Promise(resolve => setTimeout(resolve, 6000));
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