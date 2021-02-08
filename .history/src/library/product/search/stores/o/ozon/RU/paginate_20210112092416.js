async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { keywords, page, offset } = inputs;
  const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;
  await context.evaluate(async() => {
    // Add cusom next link
    const pagination = document.querySelector('.b7t2 div');
    const basicNextBtn = document.querySelector('.b6k6 a.ui-k6');
    try{
      if(pagination.hasChildNodes() && !basicNextBtn){
        const currPage = document.querySelector('.b9g0.b9g2');
        const nextPage = currPage.nextElementSibling;
        const nextPageHref = nextPage.getAttribute('href') ? nextPage.getAttribute('href') : '';
        const nextLink = document.createElement('a');
        nextLink.className = 'ui-k6 custom-nav';
        nextLink.setAttribute('href', nextPageHref);
        nextLink.textContent = 'Дальше'
        pagination.append(nextLink);
      }
    }catch(e){
      console.log('Error with custom navigation', e);
    }
  });

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

  let url = await context.evaluate(function () {
    /** @type { HTMLLinkElement } */
    const next = document.querySelector('head link[rel="next"]');
    if (!next) {
      return false;
    }
    return next.href ? next.href : '';
  });
  const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), '.b6k6 a.ui-k6');
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
  parameterValues: {
    template: null,
    country: 'RU',
    store: 'ozon',
    // nextLinkSelector: null,
    // nextLinkXpath: null,
    nextLinkSelector: '.b6k6 a.ui-k6',
    nextLinkXpath: '//div[@class="b7t2"]/div[@class="b9i0 ui-k4"]/a[@class="ui-k6"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ao4',
    loadedXpath: null,
    noResultsXPath: '//div[@class="b6q3"] | //*[contains(text(),"товаров сейчас нет")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.ozon.ru/search/?from_global=true&page={page}&text={searchTerms}',
      pageStartNb: 1,
    },
    // openSearchDefinition: {
    //   template: 'https://api.ozon.ru/composer-api.bx/page/json/v1?url=%2Fsearch%3Fpage%3D{page}&text={searchTerms}',
    //   pageStartNb: 1,
    // },
    domain: 'ozon.ru',
    zipcode: '',
  },
  implementation,
};
