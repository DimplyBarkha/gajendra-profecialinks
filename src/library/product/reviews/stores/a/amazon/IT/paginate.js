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
  const loadedSelector = 'div[data-hook=review]';
  const noResultsXPath = '//div[contains(@class, "no-reviews-section")]';
  const openSearchDefinition = {
    template: 'https://www.amazon.it/product-reviews/{id}?sortBy=recent&pageNumber={page}',
  };

  async function checkDate () {
    const deToEn = {
      gennaio: 'january',
      febbraio: 'february',
      marzo: 'march',
      aprile: 'april',
      maggio: 'may',
      giugno: 'june',
      luglio: 'july',
      agosto: 'august',
      settembre: 'september',
      ottobre: 'october',
      novembre: 'november',
      dicembre: 'december',
    };
    let reviewDateRaw = document.querySelector('div[id*="review_list"]>div:nth-last-child(2) span[data-hook*="review-date"]') ? document.querySelector('div[id*="review_list"]>div:nth-last-child(2) span[data-hook*="review-date"]').innerText : '';
    const month = reviewDateRaw.match(/([^\s]+)\s+[^\s]+$/) && reviewDateRaw.match(/([^\s]+)\s+[^\s]+$/)[1].trim();
    if (month) {
      const engMonth = deToEn[month.toLowerCase()];
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
    const next = document.querySelector('head link[rel="next"]');
    if (!next) {
      return false;
    }
    return next.href;
  });
  console.log('Input param', date);

  console.log('end date is ', new Date(date).setHours(0, 0, 0, 0));

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
    country: 'IT',
    store: 'amazon',
    nextLinkSelector: null,
    // nextLinkXpath: '//div[@data-hook="pagination-bar"]//ul//li[@class="a-last" and not(contains(@class, "a-disabled"))]',
    // mutationSelector: 'div#cm_cr-review_list',
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    // noResultsXPath: '/html[//*[@id="filter-info-section"]][not(//*[@data-hook="review"])] | /html[not(//script[contains(text(),\'pageType: "CustomerReviews"\')])] | /html[//script[contains(text(),\'pageType: "CustomerReviews"\')]][not(//div[@data-hook="review"])] | //div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //*[contains(text(),"Looking for something?")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'amazon.it',
    zipcode: '',
  },
  implementation,
};
