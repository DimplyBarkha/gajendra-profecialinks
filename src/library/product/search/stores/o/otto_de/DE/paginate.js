
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'otto_de',
    //nextLinkSelector: 'li[id="san_pagingBottomNext"] button',
    //nextLinkXpath: '//li[@id="san_pagingBottomNext"]//i[text()=">"]',
    //li[@id="san_pagingBottomNext"]//i[text()=">"]
    mutationSelector: null,
    spinnerSelector: null,
    //loadedSelector: 'div[class="content contentWithSidebar"]',
    loadedSelector: 'div[id="san_searchResult"]',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.otto.de/suche/{searchTerms}/?l=gq&o={offset}',
    },
    domain: 'otto.de',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id, date, keywords, page, offset } = inputs;
  const { nextPageUrlSelector, stopConditionSelectorOrXpath, nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, loadedXpath, resultsDivSelector, spinnerSelector, openSearchDefinition, nextLinkXpath } = parameters;

  let nextLink;



  const { pager } = dependencies;

  const success = openSearchDefinition ? false : await pager({ ...inputs, nextLinkSelector: nextLink, loadedSelector, loadedXpath, mutationSelector, spinnerSelector });

  if (success) {
    return true;
  }

  let url = openSearchDefinition ? false : await context.evaluate((nextSelectors) => {
    const selector = nextSelectors.filter(u => u).join(', ');
    const next = document.querySelector(selector);
    if (!next) return false;
    return next.href;
  }, [nextPageUrlSelector, 'head link[rel="next"]']);
  const hasselector = await context.evaluate(async () => {
    let stringhaslink;
    const haslink = document.querySelectorAll('li[id="san_pagingBottomNext"]');
    if (haslink.length > 0) {
      stringhaslink = 'YES';
    }
    else {
      stringhaslink = 'No';
    }
    return stringhaslink;
  });
  if (!url && openSearchDefinition) {
    const { pageStartNb = 1, indexOffset, pageOffset, pageIndexMultiplier, template } = openSearchDefinition;
    const pageNb = page + pageStartNb - 1;
    if (hasselector == 'YES') {
      url = template
        .replace(/{searchTerms}/g, encodeURIComponent(keywords))
        .replace(/{id}/g, encodeURIComponent(id))
        .replace(/{date}/g, encodeURIComponent(date))
        .replace(/{page}/g, (pageNb + (pageOffset || 0)).toString())
        .replace(/{index}/g, (pageNb * (pageIndexMultiplier || 0)).toString())
        .replace(/{offset}/g, (offset + (indexOffset || 0)).toString());
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
  if (loadedXpath) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.evaluate(sel, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext() || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedXpath, noResultsXPath);
  }
  console.log('Checking no results', noResultsXPath);

  if (resultsDivSelector) {
    // counting results
    const resultNB = await context.evaluate(sel => document.querySelectorAll(sel).length, resultsDivSelector);
    console.log(`The page has: ${resultNB} results. Pagination continues: ${!!resultNB}`);
    return !!resultNB;
  }

  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const e = r.iterateNext();
    return !e;
  }, noResultsXPath);
}