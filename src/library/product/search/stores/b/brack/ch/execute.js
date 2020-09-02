
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ch',
    store: 'brack',
    domain: 'brack.ch',
    url: 'https://www.brack.ch',
    loadedSelector: 'ul.productList',
    noResultsXPath: '//p[contains(text(),"Leider konnten wir zu Ihrer Suchanfrage")]',
    zipcode: "''",
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    // Hack : We are getting more number of results when searched with keyword on the webpage rather than loading the direct search term url
    await context.goto(parameters.url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    await context.evaluate(function (inputs) {
      document.querySelector('input.form-control').value = inputs.keywords;
    }, inputs);
    await context.clickAndWaitForNavigation('.input-group-append', {}, { timeout: 30000 });
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
