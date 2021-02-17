
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'parfumdreams',
    //nextLinkSelector: 'div[class="right"] a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.parfumdreams.de/?m=5&search={searchTerms}&p={page}',
    },
    domain: 'parfumdreams.de',
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

  if (stopConditionSelectorOrXpath) {
    const conditionIsTrue = await context.evaluate((sel) => {
      try {
        const isThere = document.querySelector(sel);
        return !!isThere;
      } catch (error) {
        try {
          const isThere = document.evaluate(sel, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
          return !!isThere;
        } catch (error) {
          return false;
        }
      }
    }, stopConditionSelectorOrXpath);
    // @ts-ignore
    if (conditionIsTrue) return false;
  }

  if (nextLinkSelector) {
    const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
    if (!hasNextLink) return false;
    nextLink = nextLinkSelector;
  }

  if (nextLinkXpath) {
    // add a unique ID to the elem so it can be targeted by css
    const uuid = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const hasNextLink = await context.evaluate(({ selector, uuid }) => {
      const elem = document.evaluate(selector, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      if (elem && elem.singleNodeValue && elem.singleNodeValue.nodeType === 1) { // check the node type is element
        // @ts-ignore
        elem.singleNodeValue.id = uuid;
        return true;
      }
      return false;
    }, { selector: nextLinkXpath, uuid });
    if (!hasNextLink) return false;
    nextLink = `#${uuid}`;
  }
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

  const pageURL = await context.evaluate(() => {
    let finalPage;
    let page = window.location.href;
    if (page.includes('/Redken')) {
      finalPage = page.split('?')[0] + '?p={page}';
    }
    else {
      finalPage = 'https://www.parfumdreams.de/?m=5&search={searchTerms}&p={page}';
    }
    console.log('sai')
    console.log(finalPage)
    return finalPage;
  })

  if (!url && openSearchDefinition) {
    const { pageStartNb = 1, indexOffset, pageOffset, pageIndexMultiplier } = openSearchDefinition;
    var template = pageURL;
    const pageNb = page + pageStartNb - 1;
    url = template
      .replace(/{searchTerms}/g, encodeURIComponent(keywords))
      .replace(/{id}/g, encodeURIComponent(id))
      .replace(/{date}/g, encodeURIComponent(date))
      .replace(/{page}/g, (pageNb + (pageOffset || 0)).toString())
      .replace(/{index}/g, (pageNb * (pageIndexMultiplier || 0)).toString())
      .replace(/{offset}/g, (offset + (indexOffset || 0)).toString());
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