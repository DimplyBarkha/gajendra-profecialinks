module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'brake',
    domain: 'brake.co.uk',
    url: 'https://www.brake.co.uk/search?q={searchTerms}',
    loadedSelector: 'div.product__grid',
    noResultsXPath: '//div[@class="search-empty"]',
    zipcode: '',
  },
  implementation: async function (inputs, parameters, context, dependencies) {
    // Retailer website fails to correctly paginate throughout products with inputs containing '&' sign so we change every occurance of '&' to 'and'
    Object.keys(inputs).forEach(function (key) {
      inputs[key] = inputs[key].replace(/&/g, 'and');
    });
    const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
    await dependencies.goto({ url }, {
      timeout: 30000,
      waitUntil: 'load',
      checkBlocked: true,
    });
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
    return await context.evaluate(async function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      const e = r.iterateNext();
      return !e;
    }, parameters.noResultsXPath);
  },
};
