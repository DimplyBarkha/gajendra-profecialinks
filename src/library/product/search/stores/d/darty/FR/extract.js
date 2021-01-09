const { transform } = require('../format.js');
async function implementation (
  { results },
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('button#onetrust-accept-btn-handler');
    await context.evaluate(async function (inputs) {
      const cookieButton = document.querySelector('button#onetrust-accept-btn-handler');
      cookieButton && cookieButton.click();
    });
  } catch (error) {
    console.log('Cookie button click fail');
  }
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 20000) {
      await stall(500);
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
  await context.waitForSelector('div.ot-pc-footer-logo', { timeout: 10000 });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'darty',
    transform: transform,
    domain: 'darty.com',
    zipcode: '',
  },
  implementation,
};
