/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
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
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  const productsPresent = await context.evaluate(() => Boolean(document.querySelector('div[id*="searchProductsInfo"]  div[class*="col-mini-product"] > div , div[class="product-detail-page"]')));
  if (productsPresent) {
    return;
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
    country: 'NO',
    store: 'elkjop',
    domain: 'elkjop.no',
    url: 'https://www.elkjop.no/search?SearchTerm={searchTerms}',
    loadedSelector: 'div[id*="searchProductsInfo"]  div[class*="col-mini-product"] > div   , div[class="product-detail-page"]',
    noResultsXPath: '//*[contains(@class, "no-search-result")] | //span[contains(@class,"box-title") and  contains(., "Beklager, vi fant ingen produkttreff for søkeordet")] | //section[contains(@class,"article-page main-content")]',
    zipcode: '',
    implementation,
  },
};
