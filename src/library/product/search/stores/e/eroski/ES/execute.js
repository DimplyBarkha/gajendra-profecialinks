
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.goto(parameters.url, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  await context.evaluate(function (inputs) {
    const searchInput = document.querySelector('input.search-input');
    console.log('searchInput ==', searchInput);
    if (searchInput) {
      searchInput.value = inputs.keywords;
      const searchBtn = document.querySelector('input.search-button');
      if (searchBtn) {
        searchBtn.click();
      }
    }
  }, inputs);
  // await context.clickAndWaitForNavigation('input.search-input', {}, { timeout: 30000 });
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
  
}


module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'eroski',
    domain: 'supermercado.eroski.es',
    // url: 'https://supermercado.eroski.es/es/search/results/?q={searchTerms}',
    url: 'https://supermercado.eroski.es',
    loadedSelector: 'div[id=productListZone] > div.product-item-lineal',
    noResultsXPath: '//p[@class="lineal-products-no-products"]',
    zipcode: '',
  },
  implementation 
};
