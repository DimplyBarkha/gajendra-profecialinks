module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'brake',
    domain: 'brake.co.uk',
    url: 'https://www.brake.co.uk',
    loadedSelector: 'div.product__grid',
    noResultsXPath: '//div[@class="search-empty"]',
    zipcode: '',
  },
  implementation: async function (inputs, parameters, context, dependencies) {
    // Retailer website fails to correctly paginate throughout products with inputs containing '&' sign so we change every occurance of '&' to 'and'
    await context.goto(parameters.url, {
      timeout: 30000,
      waitUntil: 'load',
      checkBlocked: true,
    });
    await context.evaluate(function (inputs) {
      Object.keys(inputs).forEach(function (key) {
        inputs[key] = inputs[key].replace(/&/g, 'and');
      });
      document.querySelector('input.js-site-search-input').value = inputs.keywords;
      document.querySelector('button.js_search_button').disabled = false;
    }, inputs);
    await context.clickAndWaitForNavigation(
      'button.js_search_button',
      {},
      { timeout: 30000 },
    );
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
