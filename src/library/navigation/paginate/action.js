// @ts-nocheck
/**
 *
 * @param {{
 *  keywords: string,
 *  page: number,
 *  offset: number,
 * }} inputs
 * @param {{
<<<<<<< HEAD
=======
 *  nextPageUrlSelector: string,
 *  nextLinkXpath: string,
 *  loadedSelector: string,
 *  loadedXpath: string,
 *  noResultsXPath: string,
 *  spinnerSelector: string,
 *  stopConditionSelectorOrXpath: string,
 *  resultsDivSelector: string,
<<<<<<< HEAD
=======
 *  dateSelector: string,
 *  datePattern: string,
 *  dateReplacePattern: string
>>>>>>> c5eae78183b04fd187a2d3dd3bfe2c3eaf644b4f
 *  openSearchDefinition: { template: string, indexOffset?: number, pageOffset?: number, pageIndexMultiplier?: number, pageStartNb?: number }
 * }} parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */

const { preCompileFunctions } = require('../navigationHelperLibrary');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id, date, keywords, page, offset } = inputs;
<<<<<<< HEAD
  const { stopConditionSelectorOrXpath, nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, loadedXpath, resultsDivSelector, spinnerSelector, openSearchDefinition, nextLinkXpath } = parameters;
=======
  const { nextPageUrlSelector, stopConditionSelectorOrXpath, nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, loadedXpath, resultsDivSelector, dateSelector, datePattern, dateReplacePattern, spinnerSelector, openSearchDefinition, nextLinkXpath } = parameters;
>>>>>>> c5eae78183b04fd187a2d3dd3bfe2c3eaf644b4f

  let nextLink;

  if (stopConditionSelectorOrXpath) {
<<<<<<< HEAD
    const conditionIsTrue = await context.waitForFunction((sel) => {
=======
    const conditionIsTrue = await context.evaluate((sel) => {
>>>>>>> c5eae78183b04fd187a2d3dd3bfe2c3eaf644b4f
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
<<<<<<< HEAD
    }, { timeout: 1000000 }, stopConditionSelectorOrXpath);
=======
    }, stopConditionSelectorOrXpath);
>>>>>>> c5eae78183b04fd187a2d3dd3bfe2c3eaf644b4f
    // @ts-ignore
    if (conditionIsTrue) return false;
  }

<<<<<<< HEAD
=======
  if (dateSelector) {
    const stopDateFound = await context.evaluate((sel, stopDate, datePattern, dateReplacePattern) => {
      try {
        const isThere = document.querySelectorAll(sel);
        if (isThere[isThere.length - 1]) {
          let pageDateStr = isThere[isThere.length - 1].textContent;
          if (datePattern && dateReplacePattern) {
            const pattern = new RegExp(datePattern, 'g');
            pageDateStr = pageDateStr.replace(pattern, dateReplacePattern);
          }

          if (new Date(pageDateStr).getTime() < new Date(stopDate).getTime()) {
            return true;
          }
        }
        return false;
      } catch (error) {
        return error.message;
      }
    }, dateSelector, date, datePattern, dateReplacePattern);
    // @ts-ignore
    console.log(stopDateFound);
    if (stopDateFound) return false;
  }

>>>>>>> c5eae78183b04fd187a2d3dd3bfe2c3eaf644b4f
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

<<<<<<< HEAD
  let url = openSearchDefinition ? false : await context.evaluate(function () {
    /** @type { HTMLLinkElement } */
    const next = document.querySelector('head link[rel="next"]');
    if (!next) {
      return false;
    }
    return next.href;
  });
=======
  let url = openSearchDefinition ? false : await context.evaluate((nextSelectors) => {
    const selector = nextSelectors.filter(u => u).join(', ');
    const next = document.querySelector(selector);
    if (!next) return false;
    return next.href;
  }, [nextPageUrlSelector, 'head link[rel="next"]']);
>>>>>>> c5eae78183b04fd187a2d3dd3bfe2c3eaf644b4f

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
<<<<<<< HEAD
    }, { timeout: 1000000 }, loadedSelector, noResultsXPath);
=======
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
>>>>>>> c5eae78183b04fd187a2d3dd3bfe2c3eaf644b4f
  }
  if (loadedXpath) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.evaluate(sel, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext() || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
<<<<<<< HEAD
    }, { timeout: 1000000 }, loadedXpath, noResultsXPath);
=======
    }, { timeout: 10000 }, loadedXpath, noResultsXPath);
>>>>>>> c5eae78183b04fd187a2d3dd3bfe2c3eaf644b4f
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
      name: 'template',
      description: 'type of template calling the code',
    },
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
<<<<<<< HEAD
=======
      name: 'nextPageUrlSelector',
      description: 'CSS selector to get next page url for goto. Use this instead of openSearchDefinition if you have multiple patterns of paginate urls and next link is present in a "href".',
    },
    {
>>>>>>> c5eae78183b04fd187a2d3dd3bfe2c3eaf644b4f
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
  get path () {
    const actionjsPath = preCompileFunctions.getRobotTemplateName();
    return this.tempPath || `${actionjsPath}/stores/\${store[0:1]}/\${store}/\${country}/paginate`;
  },
  tempPath: '',
  set path (val) {
    this.tempPath = val;
  },
  dependencies: {
    helperLib: 'action:navigation/navigationHelperLibrary',
    pager: 'action:navigation/paginate/pager',
    goto: 'action:navigation/goto',
  },
  implementation,
};
