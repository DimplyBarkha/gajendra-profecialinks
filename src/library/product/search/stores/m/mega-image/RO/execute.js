
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RO',
    store: 'mega-image',
    domain: 'mega-image.ro',
    url: 'https://www.mega-image.ro/search?q={searchTerms}',
    loadedSelector: 'ul.search-results-container:last-child',
    noResultsXPath: 'div.sc-3brks3-2.iyGbUN',
    zipcode: '',
  },
  implementation: async function (inputs, parameters, context, dependencies) {
    const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
    await dependencies.goto({ url, zipcode: inputs.zipcode });
    // Check if cookies pop-up appeared
    const doesPopupExist = await context.evaluate(function () {
      return Boolean(document.querySelector('div.v8o5b9-9.ifwxYc'));
    });
    if (doesPopupExist) {
      await context.click('div.v8o5b9-9.ifwxYc button.sc-1o6kmcs-0.hNOpUB');
    }
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
    console.log('Checking no results', parameters.noResultsXPath);
    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, parameters.noResultsXPath);
  },
};
