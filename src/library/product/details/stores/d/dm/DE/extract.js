const { transform } = require('../format.js');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // to close random popups
  const closeRandomPopups = await context.evaluate(function () {
    return !!document.evaluate('//button[@data-dmid="layer-header-close-button"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  });
  if (closeRandomPopups) {
    await context.click('button[data-dmid="layer-header-close-button"]');
  }

  // to close cookies popup on all products
  const closeCookiesPopup = await context.evaluate(function () {
    return !!document.evaluate('//button[@data-dmid="cookiebar-ok"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  });
  if (closeCookiesPopup) {
    await context.click('button[data-dmid="cookiebar-ok"]');
  }

  await new Promise(resolve => setTimeout(resolve, 6000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    transform: transform,
    domain: 'dm.de',
  },
  implementation,
};
