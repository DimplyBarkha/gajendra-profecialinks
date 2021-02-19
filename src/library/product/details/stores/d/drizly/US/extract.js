module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'drizly',
    transform: null,
    domain: 'drizly.com',
    zipcode: '',
    storeaddress: '',
    storecity: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { url, zipcode, storecity, storeaddress } = inputs;
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
    return await context.extract(dependencies.productDetails);
  },
};
