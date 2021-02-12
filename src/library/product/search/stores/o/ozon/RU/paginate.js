async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { keywords } = inputs;
  const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector } = parameters;

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

  const url = await context.evaluate(function () {
    /** @type { HTMLLinkElement } */
    const pagination = document.querySelector('.b7t2 div');
    if (pagination && pagination.hasChildNodes()) {
      const currPage = document.querySelector('.b9g0.b9g2');
      const nextPage = currPage.nextElementSibling;
      if (nextPage) {
        const nextPageHref = nextPage.getAttribute('href') ? nextPage.getAttribute('href') : '';
        const nextLink = document.createElement('a');
        nextLink.href = nextPageHref;
        nextLink.id = 'oz-next-link';
        document.body.append(nextLink);
      }
    }
    const next = document.querySelector('#oz-next-link');
    if (!next) {
      return false;
    }
    return next.href ? next.href : '';
  });

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
  implements: 'navigation/paginate',
  implementation,
  parameterValues: {
    template: null,
    country: 'RU',
    store: 'ozon',
    nextLinkSelector: null,
    nextLinkXpath: null,
    // nextLinkSelector: '.b6k6 a.ui-k6',
    // nextLinkXpath: '//div[@class="b7t2"]/div[@class="b9i0 ui-k4"]/a[@class="ui-k6"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ao4',
    loadedXpath: null,
    noResultsXPath: '//div[@class="b6q3"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.ozon.ru/search/?from_global=false&page={page}&text={searchTerms}',
      pageStartNb: 1,
    },
    domain: 'ozon.ru',
    zipcode: '',
  },
};
