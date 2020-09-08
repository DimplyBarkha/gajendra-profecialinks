/**
 *
 * @param { { _date?: string, page: number, keywords: string } } inputs
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { _date, page, keywords } = inputs;
  const loadedSelector = 'div[data-hook=review]';
  const noResultsXPath = '//div[contains(@class, "page-content") and not(//div[contains(@class, "reviews-content")])] | //div[contains(@class, "no-reviews-section")] | //a[contains(@href, "404")] | //a[contains(@href, "dogsofamazon")] | //b[contains(@class, "h1") and contains(text(), "particolare")] | //b[contains(@class, "h1") and contains(text(), "Buscas algo")] | //img[contains(@alt, "fetch that page")] | //b[contains(text(), "Vous recherchez")]';
  const openSearchDefinition = {
    template: 'https://www.amazon.fr/product-reviews/{searchTerms}?sortBy=recent&pageNumber={page}',
  };

  async function checkDate () {
    const frToEn = {
      janvier: 'january',
      février: 'february',
      mars: 'march',
      avril: 'april',
      mai: 'may',
      juin: 'june',
      juillet: 'july',
      août: 'august',
      septembre: 'september',
      octobre: 'october',
      novembre: 'november',
      décembre: 'december',
    };
    let reviewDateRaw = document.querySelector('div[id*="review_list"]>div:nth-last-child(2) span[data-hook*="review-date"]') ? document.querySelector('div[id*="review_list"]>div:nth-last-child(2) span[data-hook*="review-date"]').innerText : '';
    const month = reviewDateRaw.match(/([^\s]+)\s*[^\s]+$/) && reviewDateRaw.match(/([^\s]+)\s*[^\s]+$/)[1];
    if (month) {
      const engMonth = frToEn[month];
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

  if ((new Date(await context.evaluate(checkDate)).setHours(0, 0, 0, 0) - new Date(_date).setHours(0, 0, 0, 0)) < 0) {
    return false;
  } else {
    if (!url && openSearchDefinition) {
      url = openSearchDefinition.template
        .replace('{searchTerms}', encodeURIComponent(keywords))
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
      name: 'noResultsXPath',
      description: 'XPath selector for no results',
    },
    {
      name: 'openSearchDefinition',
      description: 'Open search definition object',
    },
  ],
  inputs: [{
    name: '_date',
    description: 'date of last review that should be extracted',
  }, {
    name: 'id',
    description: 'asin of product',
  }],
  path: './stores/${store[0:1]}/${store}/${country}/paginate',
  dependencies: {
    pager: 'action:product/search/paginate/pager',
    goto: 'action:navigation/goto',
  },
  implementation,
};
