async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { date, page, id } = inputs;
  const loadedSelector = 'ul.review-list';
  const noResultsXPath = '//div[contains(@class, "no-reviews-section")]';
  const mutationSelector = 'article#shop-body-2 ul';
  // const openSearchDefinition = {
  //   template: 'https://www.amazon.it/product-reviews/{id}?sortBy=recent&pageNumber={page}',
  // };

  async function checkDate () {
    const reviewDateRaw = document.querySelector('ul.review-list li:last-child span.date') ? document.querySelector('ul.review-list li:last-child span.date').innerText : '';
    const topReviewDate = new Date(reviewDateRaw);
    if (topReviewDate) {
      const month = '' + (topReviewDate.getMonth() + 1);
      const day = '' + topReviewDate.getDate();
      const year = topReviewDate.getFullYear();
      console.log(`${[year, month, day].join('-')}`);
      return `${[year, month, day].join('-')}`;
    } else {
      return false;
    }
  }

  const { pager } = dependencies;
  const success = await pager({ loadedSelector });
  if (success) {
    return true;
  }

  const url = await context.evaluate(function () {
    /** @type { HTMLLinkElement } */
    const next = document.querySelector('a.arr-next');
    if (!next) {
      return false;
    }
    return true;
  });
  console.log('Input param', date);

  console.log('end date is ', new Date(date).setHours(0, 0, 0, 0));

  if ((new Date(await context.evaluate(checkDate)).setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) < 0) {
    return false;
  } else {
    if (url) {
      await Promise.all([
        context.click('a.arr-next'),
        // context.waitForMutuation(mutationSelector, { timeout: 20000 }),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
    }
  }

  if (!url) {
    return false;
  }
  async function checkNoPagination () {
    const nextPageBtn = document.querySelector('a.arr-next');
    if (!nextPageBtn) {
      return true;
    } else {
      return false;
    }
  }
  if (await context.evaluate(checkNoPagination)) {
    return false;
  }

  // console.log('GOING to url', url);
  // await dependencies.goto({ url });
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
    country: 'KO',
    store: 'discoverglo',
    // nextLinkSelector: 'a.arr-next',
    nextPageUrlSelector: null,
    nextLinkXpath: null,
    // mutationSelector: 'article#shop-body-2 ul',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'discoverglo.co.kr',
    zipcode: '',
  },
  implementation,
};
