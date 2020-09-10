async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { keywords, page, offset } = inputs;
  const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;

   let url = await context.evaluate(function () {
    
    const next = document.querySelector('pagination-template > ul > li.active').nextElementSibling

    if (!next) {
      return false;
    }

  });

  const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector).nextElementSibling, 'pagination-template > ul > li.active ');
  if (!hasNextLink) {
    return false;
  }

  if (!url && openSearchDefinition) {
    url = openSearchDefinition.template
      .replace('{searchTerms}', encodeURIComponent(keywords))
      .replace('{page}', (page + (openSearchDefinition.pageOffset || 0)).toString())
      .replace('{offset}', (offset + (openSearchDefinition.indexOffset || 0)).toString());
  }

  if (!url) {
    return false;
  }

  await dependencies.goto({ url });
  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 20000 }, loadedSelector, noResultsXPath);
  }

  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const e = r.iterateNext();
    return !e;
  }, noResultsXPath);
}

module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'appliancesonline',
    domain: 'appliancesonline.com.au',
    nextLinkSelector: 'pagination-template > ul > li:not(.active)',
    loadedSelector: 'div.grid-container-flex',
    openSearchDefinition: {
      template: 'https://www.appliancesonline.com.au/search/{searchTerms}?currentpage={page}&sortkey=highestrated',
    },
  },
  implementation,
};
