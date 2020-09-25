const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const cssBtn = 'section#specs div.u5QDkd a';

  const isSelectorAvailable = async (cssSelector) => {
    console.log(`Is selector available: ${cssSelector}`);
    return await context.evaluate(function (selector) {
      return !!document.querySelector(selector);
    }, cssSelector);
  };

  console.log('.....waiting......');

  try {
    await context.waitForSelector(cssBtn, { timeout: 10000 });

    const detailspecificationAvailable = await isSelectorAvailable(cssBtn);
    console.log(`detailspecification: ${detailspecificationAvailable}`);
    if (detailspecificationAvailable) {
      console.log('clicking detailspecification link');
      await context.click(cssBtn);
      await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
      console.log('navigation complete!!');
    }
  } catch (err) {

  }
  // await context.evaluate(async function () {
  //   try {
  //     context.goto('https://www.google.com/shopping/product/4651609126134160693/specs?psb=1&prds=rj:1');
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'googleshopping',
    transform: null,
    domain: 'shopping.google.com',
    zipcode: '',
  },
  implementation: implementation,
};
