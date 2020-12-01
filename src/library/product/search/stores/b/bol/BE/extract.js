const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'bol',
    transform,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      const cookiesButton = document.evaluate(
        '//wsp-consent-modal[h2[span[contains(text(), "cookie")]]]//button[@class="js-confirm-button"]',
        document,
        null,
        XPathResult.ANY_UNORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (cookiesButton) {
        cookiesButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      document.body.setAttribute('added_search_url', window.location.href);
    });
    return await context.extract(productDetails, { transform });
  },
};
