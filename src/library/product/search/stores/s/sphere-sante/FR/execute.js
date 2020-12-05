
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
    console.log(inputs.keywords);
    await context.evaluate(async function (inputs) {
      document.querySelector('input.search-input.searchTrack').value = inputs.keywords;
    }, inputs);
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.click('.searchfbutton.searchButtonTrack.searchBarHeader-image');
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
