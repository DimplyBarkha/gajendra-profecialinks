async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { keywords, page, offset } = inputs;
  const { nextLinkSelector, loadedSelector, noResultsXPath, openSearchDefinition } = parameters;

  if (nextLinkSelector) {
    const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
    if (!hasNextLink) {
      return false;
    }
  }

  const goodSearch = await context.evaluate((selector) => document.querySelector('div[data-automation-id="spellsuggest"] b') ? document.querySelector('div[data-automation-id="spellsuggest"] b').textContent : '');

  let url = '';

  const searchKeyword = goodSearch.length ? goodSearch : keywords;

  if (openSearchDefinition) {
    url = openSearchDefinition.template
      .replace('{searchTerms}', encodeURIComponent(searchKeyword))
      .replace('{page}', (page + (openSearchDefinition.pageOffset || 0)).toString())
      .replace('{offset}', (offset + (openSearchDefinition.indexOffset || 0)).toString());
    url += '&spelling=true';
  }

  if (!url) {
    return false;
  }

  console.log('Going to url', url);
  await dependencies.goto({ url });
  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log('Checking no results', noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
}
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'walmartOG',
    nextLinkSelector: 'button[aria-label="next page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-automation-id="productsList"] div[data-automation-id="productTile"],div[data-automation-id="productsListPage"] [data-automation-id="noResultsSearchTerm"]',
    openSearchDefinition: {
      template: 'https://walmart.com/grocery/search/?query={searchTerms}&page={page}',
    },
    domain: 'grocery.walmart.com',
  },
  implementation: implementation,
};
