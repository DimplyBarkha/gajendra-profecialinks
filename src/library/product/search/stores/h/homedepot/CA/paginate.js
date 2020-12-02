/**
 *
 * @param {{
  *  keywords: string,
  *  page: number,
  *  offset: number,
  * }} inputs
  * @param {{
  *  nextLinkSelector: string,
  *  nextLinkXpath: string,
  *  mutationSelector: string,
  *  loadedSelector: string,
  *  loadedXpath: string,
  *  noResultsXPath: string,
  *  spinnerSelector: string,
  *  stopConditionSelectorOrXpath: string,
  *  resultsDivSelector: string,
  *  openSearchDefinition: { template: string, indexOffset?: number, pageOffset?: number, pageIndexMultiplier?: number, pageStartNb?: number }
  * }} parameters
  * @param { ImportIO.IContext } context
  * @param { Record<string, any> } dependencies
  */

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { keywords, page, offset } = inputs;
  const { stopConditionSelectorOrXpath, nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, loadedXpath, resultsDivSelector, spinnerSelector, openSearchDefinition, nextLinkXpath } = parameters;

  let nextLink;

  if (stopConditionSelectorOrXpath) {
    const conditionIsTrue = await context.waitForFunction((sel) => {
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
    }, { timeout: 10000 }, stopConditionSelectorOrXpath);
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

  let url = openSearchDefinition ? false : await context.evaluate(function () {
    /** @type { HTMLLinkElement } */
    const next = document.querySelector('head link[rel="next"]');
    if (!next) {
      return false;
    }
    return next.href;
  });

  if (!url && openSearchDefinition) {
    const { pageStartNb = 1, indexOffset, pageOffset, pageIndexMultiplier, template } = openSearchDefinition;
    const pageNb = page + pageStartNb - 1;
    // @ts-ignore
    const searchUrl = await context.evaluate(() => window.location.href && window.location.href.match(/(.*)categories(.*)/) && window.location.href);
    if (searchUrl) {
      if (searchUrl.toString().match(/(.*)&page=(\d+)/)) {
        url = searchUrl.toString().replace(/(.*)&page=(\d+)/g, `$1&page=${(pageNb + (pageOffset || 0)).toString()}`);
      } else {
        url = `${searchUrl.toString()}&page=${(pageNb + (pageOffset || 0)).toString()}`;
      }
    } else {
      url = template
        .replace(/{searchTerms}/g, encodeURIComponent(keywords))
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
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'acl-product-card-group[evtperfname*="acl-product-card-group"],.hdca-cms-content-banner__content-box',
    noResultsXPath: '//header//div[contains(text(), "something went wrong")]|//div[@id="null-search-page-container"]|//h1[contains(@class,"cl-title--large")]//span[text()="0"]|//null-search//span[contains(text(), "we found 0 result ")]|//div[contains(text(), "0 results for")]',
    openSearchDefinition: {
      template: 'https://www.homedepot.ca/search?q={searchTerms}:relevance&page={page}',
    },
    domain: 'homedepot.ca',
    zipcode: '',
  },
  implementation,
};
