const { transform } = require('../format.js');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
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
