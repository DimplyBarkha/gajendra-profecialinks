
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'mediamarkt',
    domain: 'mediamarkt.nl',
    url: 'https://www.mediamarkt.nl/nl/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmnlnl',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    console.log('params', parameters);
    const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
    await dependencies.goto({ url, zipcode: inputs.zipcode });
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 20000 }, parameters.loadedSelector, parameters.noResultsXPath);
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
