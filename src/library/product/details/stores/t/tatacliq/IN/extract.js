const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'tatacliq',
    transform,
    domain: 'tatacliq.com',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const result = await context.evaluate(() => {
      return Boolean(document.evaluate(`//div[contains(.,'more details')]/span[contains(.,'click')]`, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    });

    if (result) {
      await context.evaluate(() => {
        // @ts-ignore
        document.evaluate(`//div[contains(.,'more details')]/span[contains(.,'click')]`, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().click();
      });

      await context.waitForFunction(function (xp) {
        return Boolean(document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, `//div[contains(.,"Manufacturer's Details")]`);
    }
    return await context.extract(productDetails, { transform });
  }

};