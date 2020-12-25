const { pagerOne } = require('./pagerOne');
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
  // @ts-ignore
  const { id, date, keywords, page, offset } = inputs;
  // @ts-ignore
  const { pagerOne, stopConditionSelectorOrXpath, nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, loadedXpath, resultsDivSelector, spinnerSelector, openSearchDefinition, nextLinkXpath } = parameters;

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
    // eslint-disable-next-line no-unused-vars
    nextLink = `#${uuid}`;
  }

  const success = openSearchDefinition ? false : await pagerOne({ ...inputs, nextLinkSelector, loadedSelector, loadedXpath, mutationSelector, spinnerSelector }, {}, context, {});

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

module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    pagerOne,
    template: null,
    country: 'DE',
    store: 'idealo',
    nextLinkSelector: 'li[class="pagination-item next"] a[rel="next"]',
    nextLinkXpath: '(//li[@class="pagination-item next"]//a[@rel="next"])[1]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"no-result-SuggestionText")]',
    loadedXpath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'idealo.de',
    zipcode: '',
  },
  implementation,
};
