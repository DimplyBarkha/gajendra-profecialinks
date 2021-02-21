async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { date, page, id } = inputs;
  const loadedSelector = 'div.review_summary ul#reviews_wrapper';
  const noResultsXPath = '//div[@class="review_summary"]//ul[@id="reviews_wrapper" and string-length(*)=0]';
  const mutationSelector = 'div.review_summary ul#reviews_wrapper li';

  async function checkDate () {
    const reviewDateRaw = document.querySelector('ul#reviews_wrapper >  li:last-child div.review_user_info span:nth-child(2)') ? document.querySelector('ul#reviews_wrapper >  li:last-child div.review_user_info span:nth-child(2)').innerText : '';
    const topReviewDate = new Date(reviewDateRaw);
    if (topReviewDate) {
      const month = '' + (topReviewDate.getMonth() + 1);
      const day = '' + topReviewDate.getDate();
      const year = topReviewDate.getFullYear();
      console.log(`last review date: ${[year, month, day].join('-')}`);
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
    const next = document.querySelector('div.paginate a.current + a.next');
    if (next) {
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
        context.click('a.next'),
        // context.waitForMutuation('div.review_summary ul#reviews_wrapper li', { timeout: 20000 }),
        new Promise((resolve) => setTimeout(resolve, 10000)),
      ]);
    }
  }

  if (!url) {
    return false;
  }
  async function checkNoPagination () {
    const nextPageBtn = document.querySelector('a.next');
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
    country: 'JP',
    store: 'qoo10',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'qoo10.jp',
    zipcode: '',
  },
  implementation,
};
