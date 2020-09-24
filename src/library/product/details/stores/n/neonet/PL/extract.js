const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const cssBtn = 'button.productDetailGallery-finiteNavigator-3iH:last-child';

  const isSelectorAvailable = async (cssSelector) => {
    console.log(`Is selector available: ${cssSelector}`);
    return await context.evaluate(function (selector) {
      return !!document.querySelector(selector);
    }, cssSelector);
  };

  console.log('.....waiting......');

  for (let cnt = 0; cnt < 15; cnt++) {
    try {
      await context.waitForSelector(cssBtn, { timeout: 10000 });

      const productAvailable = await isSelectorAvailable(cssBtn);
      console.log(`productAvailable: ${productAvailable}`);
      if (productAvailable) {
        console.log('clicking product link');
        await context.click(cssBtn);
        await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
        console.log('navigation complete!!');
      }
    } catch (err) {

    }
  }
  await context.evaluate(async function () {

  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'neonet',
    transform: transform,
    domain: 'neonet.pl',
    zipcode: '',
  },
  implementation: implementation,
};
