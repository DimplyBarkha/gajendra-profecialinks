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
  const loadedSelector = 'section#lotReviewContents';
  const noResultsXPath = '//div[contains(@class,"NoResultPage")]';
  const openSearchDefinition = {
    template: 'https://wowma.jp/items/{id}/reviews?order=created_desc&page={page}',
  };

  async function checkDate () {
    const reviewDateRaw = document.querySelector('li.-JanReviewList--singleReviewItem--br9bF-:last-child  div.-ReviewedComment--publishInfo--1Jqo1-') ? document.querySelector('li.-JanReviewList--singleReviewItem--br9bF-:last-child  div.-ReviewedComment--publishInfo--1Jqo1-').innerText : '';
    const topReviewDate = new Date(reviewDateRaw);
    if (topReviewDate) {
      const month = '' + (topReviewDate.getMonth() + 1);
      const day = '' + topReviewDate.getDate();
      const year = topReviewDate.getFullYear();
      console.log(`${[year, month, day].join('-')}`);
      return `last review date: ${[year, month, day].join('-')}`;
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
    const next = document.querySelector('a.stIconMd-keyboard-arrow-right');
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
    const nextPageBtn = document.querySelector('a.stIconMd-keyboard-arrow-right');
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
    store: 'wowma',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'wowma.jp',
    zipcode: '',
  },
  implementation
};
