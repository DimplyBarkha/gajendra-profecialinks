
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="Product"]',
    noResultsXPath: null,
    openSearchDefinition: {
      template: "https://www.feelunique.com/search?csf=true&q={searchTerms}&go=",
      },
    domain: 'feelunique.com',
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
  const { stopConditionSelectorOrXpath, nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, loadedXpath, resultsDivSelector, spinnerSelector, openSearchDefinition, nextLinkXpath } = parameters;
  let nextLink;
  if (nextLinkSelector) {
  const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
  if (!hasNextLink) return false;
  nextLink = nextLinkSelector;
  }
  const { pager } = dependencies;
  const success = await pager({ ...inputs, nextLinkSelector: nextLink, loadedSelector, loadedXpath, mutationSelector, spinnerSelector });
  if (success) {
  return true;
  }
  let url = openSearchDefinition ? false : await context.evaluate(function () {
  /** @type { HTMLLinkElement } */
  const next = document.querySelector('div[class="eba-component loadMoreContainer"]');
  if (!next) {
  return false;
  }
  return next.href;
  });
  const pageURL = await context.evaluate(async function () {
  try {
  let page = document.querySelector('a[class="loadMoreButton"]').getAttribute('href');
  return "https://www.feelunique.com" + page;
  } catch (error) {
  }
  });
  if (!url && openSearchDefinition) {
  const { pageStartNb = 1, indexOffset, pageOffset, pageIndexMultiplier, template } = openSearchDefinition;
  if (pageURL != null) {
  url = pageURL;
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
