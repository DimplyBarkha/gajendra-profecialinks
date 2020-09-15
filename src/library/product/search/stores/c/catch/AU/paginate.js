async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { keywords, page, offset } = inputs;
  const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;

   let url = await context.evaluate(function () {
    
    const next = document.querySelector('button.css-wzwbsc-Button-Button').nextElementSibling

    if (!next) {
      return false;
    }

  });

  const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector).nextElementSibling, 'button.css-wzwbsc-Button-Button');
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
    store: 'catch',
    nextLinkSelector: 'button.css-wzwbsc-Button-Button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.grid-row product-flex',
    noResultsXPath: null,    
    domain: 'catch.com.au',
    zipcode: '',
    openSearchDefinition: {
      template: 'https://www.catch.com.au/search?query={searchTerms}&search_src=topbar&ac=0&page={page}',
    },
  },
  implementation,  
};
