
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    domain: 'coolblue.nl',
    url: 'https://www.coolblue.nl/zoeken?query={searchTerms}',
    loadedSelector: 'div.product-grid__products',
    noResultsXPath: '//h1[contains(.,"Geen resultaten voor")]',
    zipcode: '',
  },
  implementation: async function (inputs, parameters, context, dependencies) {
    const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
    await dependencies.goto({ url }, {
      timeout: 30000,
      waitUntil: 'load',
      checkBlocked: true,
    });

    await context.evaluate(function () {
      const cookieButton = document.querySelector('button[name="accept_cookie"]');
      if (cookieButton) {
        cookieButton.click();
      }
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
