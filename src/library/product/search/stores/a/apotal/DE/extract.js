const { transform } = require('../format.js');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  const cookiesAcceptPopup = await context.evaluate(function () {
    return !!document.evaluate('//div[@id="cookie-message"]//button[@class="accept-all-cookies"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  });
  if (cookiesAcceptPopup) {
    await context.click('div#cookie-message button.accept-all-cookies');
  }

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'apotal',
    transform: transform,
    domain: 'apotal.de',
    zipcode: '',
  },
  implementation,
};
