async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { keywords, page, offset } = inputs;
  const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;

  let url = await context.evaluate(function () {
    const next = document.querySelector('div.productListingstyled__Pagination-sc-124p81z-18 > a[data-testid=page-next]')
    if (!next) { return false; }
  });

  const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), 'div.productListingstyled__Pagination-sc-124p81z-18 > a[data-testid=page-next] '); if (!hasNextLink) { return false; }
  if (!url && openSearchDefinition) {
    url = openSearchDefinition.template
      .replace('{searchTerms}', encodeURIComponent(keywords))
      .replace('{page}', (page + (openSearchDefinition.pageOffset || 0)).toString())
      .replace('{offset}', (offset + (openSearchDefinition.indexOffset || 0)).toString());
  }

  if (!url) {
    return false;
  }

  console.log('Going to url', url);
  await dependencies.goto({ url });
  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 20000 }, loadedSelector, noResultsXPath);
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
    country: 'AU',
    store: 'qantas',
    nextLinkSelector: 'div.productListingstyled__Pagination-sc-124p81z-18 > a[data-testid=page-next]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.productListingstyled__Grid-sc-124p81z-7',
    noResultsXPath: '//div[contains(@class,"productListingstyled__NoProducts-sc-124p81z-21")]',
    openSearchDefinition: {
      template: 'https://store.qantas.com/au/search/{searchTerms}/page-{page}',
    },
    domain: 'store.qantas.com',
    zipcode: '',
  },
  implementation,
};
