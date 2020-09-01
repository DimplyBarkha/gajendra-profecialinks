const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    transform: transform,
    domain: 'allegro.pl',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    const policyAcceptPopup = await context.evaluate(function () {
      return !!document.evaluate('//button[@data-role="accept-consent"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    if (policyAcceptPopup) {
      await context.click('button[data-role="accept-consent"]');
    }
    return await context.extract(productDetails, { transform });
  },
};
