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

  let url = await context.evaluate(function () {
    /** @type { HTMLLinkElement } */
    const next = document.querySelector('head link[rel="next"]');
    if (!next) {
      return false;
    }
    return next.href;
  });

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
  await context.setLoadAllResources(true);
  await context.setAntiFingerprint(false);
  await context.setBlockAds(false);
  await dependencies.goto({ url }, { timeout: 30000, waitUntil: 'load', checkBlocked: true, first_request_timeout: 60, load_timeout: 60 });
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
    country: 'CA',
    store: 'walmart',
    // nextLinkSelector: "a[data-automation*='pagination-next-button']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "[data-automation*='product-results'] [data-automation*='product']",
    noResultsXPath: "//div[contains(@data-automation,'search-result-header') and contains(.,'We couldn')] | //h1[contains(@data-automation,'null-results-message')]",
    openSearchDefinition: {
      page: 0,
      template: 'https://www.walmart.ca/search?q={searchTerms}&p={page}',
    },
    domain: 'walmart.ca',
    zipcode: '',
  },
  implementation,
};
