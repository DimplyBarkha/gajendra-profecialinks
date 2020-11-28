
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'sphere-sante',
    domain: 'sphere-sante.com',
    url: 'https://www.sphere-sante.com/',
    loadedSelector: 'div.page',
    noResultsXPath: '//div[@class="row alert red alert-danger" and contains(., "Aucun produit ne correspond à votre recherche")]',
    zipcode: "''",
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    await context.goto('https://www.sphere-sante.com/');
    await context.setInputValue('input.search-input.searchTrack', inputs.keywords);
    await new Promise(resolve => setTimeout(resolve, 30000));
    await context.clickAndWaitForNavigation('.searchfbutton.searchButtonTrack.searchBarHeader-image', {}, { timeout: 100000 });
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
