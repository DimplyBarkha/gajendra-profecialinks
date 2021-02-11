const { transform } = require('../format.js');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const mainUrl = await context.evaluate(function () {
    return window.location.href;
  })

  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  const policyAcceptPopup = await context.evaluate(function () {
    return !!document.evaluate('//div[contains(@class, "cmsCookieNotification__button--accept")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  });
  if (policyAcceptPopup) {
    await context.click('div.cmsCookieNotification__button.cmsCookieNotification__button--accept');
  }

  const policyAcceptPopup1 = await context.evaluate(function () {
    return !!document.evaluate('//li[@class="cmsHeaderMain__item cmsHeaderMain__item--settings"]//div[contains(@class, "cmsHeaderIdentificationPopup")]//div[contains(@class, "cmsIdentificationPopup__button__b2c")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  });
  if (policyAcceptPopup1) {
    await context.click('li.cmsHeaderMain__item.cmsHeaderMain__item--settings div.cmsHeaderIdentificationPopup.cmsHeaderIdentificationPopup--flyout div.cmsIdentificationPopup__buttons div.cmsIdentificationPopup__button.cmsIdentificationPopup__button__b2c');
  }

  // Adding variant logic

  const variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('section.packingUnit__packagingSelector button.packingUnit__button')) ? document.querySelectorAll('section.packingUnit__packagingSelector button.packingUnit__button').length : 0;
  });

  if (variantLength > 1) {
    for (let j = 0; j < variantLength; j++) {
      await context.evaluate(async (j) => {
        return document.querySelectorAll('section.packingUnit__packagingSelector button.packingUnit__button')[j].click();
      }, j)
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));

      const videoLink = await context.evaluate(function () {
        return !!document.evaluate('//div[@class="productImage__imageListWrapper"]//a[contains(@class, "productImage__video")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      });
      if (videoLink) {
        await context.click('div.productImage__imageListWrapper a.productImage__video');
      }

      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      const playBtn = await context.evaluate(function () {
        return !!document.evaluate('//div[@id="fullscreenActiveImagecontainer"]//img[contains(@class, "Playbtn")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      });

      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      if (playBtn) {
        await context.click('div#fullscreenActiveImagecontainer img:nth-child(3)');
      }
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
      if (variantLength - 1 != j) {
        await context.goto(mainUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
        await context.waitForNavigation();
        await new Promise((resolve, reject) => setTimeout(resolve, 6000));
      }
    }
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'conrad',
    transform: transform,
    domain: 'conrad.de',
    zipcode: '',
  },
  implementation,
};
