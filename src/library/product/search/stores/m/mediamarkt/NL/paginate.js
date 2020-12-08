async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { keywords, page, offset } = inputs;
  const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;

  if (nextLinkSelector) {
    const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
    if (!hasNextLink) {
      return false;
    }
  }

  const { pager } = dependencies;
  const success = await pager({ keywords, nextLinkSelector, loadedSelector, mutationSelector, spinnerSelector });
  if (success) {
    return true;
  }

  const activePageExists = await context.evaluate(function () {
    return document.querySelector('ul.pagination li.active') ? document.querySelector('ul.pagination li.active').textContent.trim() : null;
  });

  if (activePageExists == null) {
    return false;
  }

  let url = null;
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
    country: 'NL',
    store: 'mediamarkt',
    nextLinkSelector: null,
    // nextLinkSelector: 'ul.pagination li.pagination-next a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    // spinnerSelector: 'div.spinner',
    loadedSelector: 'ul.products-list',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.mediamarkt.nl/nl/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmnlnlt&page={page}',
    },
    domain: 'mediamarkt.nl',
    zipcode: '',
  },
  implementation,
};
