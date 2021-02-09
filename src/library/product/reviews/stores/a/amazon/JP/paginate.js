/**
 *
 * @param { { date?: string, page: number, id: string } } inputs
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { date, page, id } = inputs;
  const loadedSelector = 'div#cm_cr-review_list';
  const noResultsXPath = '//td/b[contains(text(),"Looking for something?")]';
  const openSearchDefinition = {
    template: 'https://www.amazon.co.jp/-/en/product-reviews/{id}/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews&sortBy=recent&pageNumber={page}',
  };

  async function checkDate () {
    let reviewDateRaw = document.querySelector('div[id*="review_list"]>div:nth-last-child(2) span[data-hook*="review-date"]') ? document.querySelector('div[id*="review_list"]>div:nth-last-child(2) span[data-hook*="review-date"]').innerText : '';
    const month = reviewDateRaw.match(/([^\s]+)\s+[^\s]+\s+[^\s]+$/) && reviewDateRaw.match(/([^\s]+)\s+[^\s]+\s+[^\s]+$/)[1].trim();
    if (month) {
      const engMonth = month.toLowerCase();
      reviewDateRaw = reviewDateRaw.replace(month, engMonth);
    }
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

  let url = await context.evaluate(function () {
    /** @type { HTMLLinkElement } */
    const next = document.querySelector('li.a-last a');
    if (!next) {
      return false;
    }
    return next.href;
  });

  if ((new Date(await context.evaluate(checkDate)).setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) < 0) {
    return false;
  } else {
    if (!url && openSearchDefinition) {
      url = openSearchDefinition.template
        .replace('{id}', encodeURIComponent(id))
        .replace('{page}', (page + (openSearchDefinition.pageOffset || 0)).toString());
    }
  }

  if (!url) {
    return false;
  }
  async function checkNoPagination () {
    const nextPageBtn = document.querySelector('ul.a-pagination>li.a-last>a');
    if (!nextPageBtn) {
      return true;
    } else {
      return false;
    }
  }
  if (await context.evaluate(checkNoPagination)) {
    return false;
  }

  console.log('GOING to url', url);
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
    country: 'JP',
    store: 'amazon',
    // nextLinkSelector: null,
    // nextLinkXpath: null,
    // mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    // noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'amazon.co.jp',
    zipcode: '',
  },
  implementation,
};
