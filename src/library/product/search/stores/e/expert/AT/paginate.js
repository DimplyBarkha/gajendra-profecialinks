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

  let url = null;

  console.log('(!url && openSearchDefinition)');
  console.log((!url && openSearchDefinition));

  if (!url && openSearchDefinition) {
    url = openSearchDefinition.template
      .replace('{searchTerms}', encodeURIComponent(keywords))
      .replace('{page}', (page + (openSearchDefinition.pageOffset || 0)).toString())
      .replace('{offset}', (offset + (openSearchDefinition.indexOffset || 0)).toString());

    const productObj = await context.evaluate(function () {
      const prodObj = document.querySelector('div.product-paging') ? document.querySelector('div.product-paging').textContent.trim() : '';
      const prodObjArr = prodObj.split('bis');
      const prodObjStr = prodObjArr.length === 2 ? prodObjArr[1] : '';
      console.log(prodObjStr);
      const allPages = prodObjStr.trim().split('von');
      const productSoFar = allPages[0].trim();
      const totalProducts = allPages[1].trim();
      return { productSoFar: productSoFar, totalProducts: totalProducts, prodObj: prodObj, prodObjStr: prodObjStr };
    });
    if (productObj) {
      if (parseInt(productObj.productSoFar) === parseInt(productObj.totalProducts)) {
        return false;
      }
    } else {
      return false;
    }
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
    country: 'AT',
    store: 'expert',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-paging, div.product-item a',
    noResultsXPath: '//*[contains(text(),"Leider aktuell kein Treffer zu Ihrem Suchbegriff")]',
    openSearchDefinition: {
      template: 'https://www.expert.at/shop?q={searchTerms}&page={page}',
    },
    domain: 'expert.at',
    zipcode: '',
  },
  implementation,
};