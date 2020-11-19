/**
 *
 * @param {{
 *  keywords: string,
 *  page: number,
 *  offset: number,
 *  id: string,
 * }} inputs
 * @param {{
 *  nextLinkSelector: string,
 * nextLinkXpath: string,
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
      } catch (error) {}
      try {
        const isThere = document.evaluate(sel, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
        return !!isThere;
      } catch (error) {}
      return false;
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
  const success = await pager({ keywords, nextLinkSelector: nextLink, loadedSelector, loadedXpath, mutationSelector, spinnerSelector });
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
    const { pageStartNb, indexOffset, pageOffset, pageIndexMultiplier, template } = openSearchDefinition;
    const pageNb = page + pageStartNb - 1;
    url = template
      .replace('{searchTerms}', encodeURIComponent(keywords))
      .replace('{page}', (pageNb + (pageOffset || 0)).toString())
      .replace('{index}', (pageNb * (pageIndexMultiplier || 0)).toString())
      .replace('{offset}', (offset + (indexOffset || 0)).toString());
  }

  if (!url) {
    return false;
  }

  console.log('Going to url', url);
  await dependencies.goto({ url, inputs });
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
  parameters: [
    {
      name: 'country',
      description: '2 letter ISO code for the country',
    },
    {
      name: 'store',
      description: 'store name',
    },
    {
      name: 'nextLinkSelector',
      description: 'CSS selector for the next link',
    },
    {
      name: 'nextLinkXpath',
      description: 'Xpath selector for the next link',
    },
    {
      name: 'mutationSelector',
      description: 'CSS selector for what to wait to change (if in-page pagination)',
    },
    {
      name: 'spinnerSelector',
      description: 'CSS selector for a spinner to wait to disappear (if in-page pagination)',
    },
    {
      name: 'loadedSelector',
      description: 'CSS to tell us the page has loaded',
    },
    {
      name: 'loadedXpath',
      description: 'Xpath to tell us the page has loaded',
    },
    {
      name: 'noResultsXPath',
      description: 'XPath selector for no results',
    },
    {
      name: 'stopConditionSelectorOrXpath',
      description: 'if this selectors returns an element then the pagination is brought to an end',
    },
    {
      name: 'resultsDivSelector',
      description: 'alternative to noResultsXPath, if the count is zero the pagination stops',
    },
    {
      name: 'openSearchDefinition',
      description: 'Open search definition object',
    },
  ],
  inputs: [{
    name: 'keywords',
    description: 'search terms',
  }, {
    name: 'page',
    description: 'page number (1 indexed)',
  }, {
    name: 'offset',
    description: 'offset (0 indexed)',
  }],
  path: './stores/${store[0:1]}/${store}/${country}/paginate',
  dependencies: {
    pager: 'action:product/search/paginate/pager',
    goto: 'action:navigation/goto',
  },
  implementation,
};
