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
  const loadedSelector = 'div#__ozon';
  const noResultsXPath = '//h2[contains(text(),"Произошла ошибка")]';
  const openSearchDefinition = {
    template: 'https://www.ozon.ru/product/{id}/reviews/?page={page}&sort=created_at_desc',
  };

  async function checkDate () {
    const deToEn = {
      января: 'january',
      февраля: 'february',
      марта: 'march',
      апреля: 'april',
      мая: 'may',
      июня: 'june',
      июля: 'july',
      августа: 'august',
      сентября: 'september',
      октября: 'october',
      ноября: 'november',
      декабря: 'december',
    };
    let reviewDateRaw = document.querySelector('div.b7y3:nth-last-child(1) div.a4z6') ? document.querySelector('div.b7y3:nth-last-child(1) div.a4z6').innerText : '';
    const month = reviewDateRaw.match('^(?:.+?[\\s.,;]+){' + (1) + '}([^\\s.,;]+)')[1];
    if (month) {
      const engMonth = deToEn[month.toLowerCase()];
      reviewDateRaw = reviewDateRaw.replace(month, engMonth);
    }
    reviewDateRaw = reviewDateRaw.replace(/\s/g, '-');
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
    const nlink = document.querySelector('a.a4q7');
    const next = nlink.nextElementSibling;
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
    const nextPageBtn = document.evaluate('count(//div[contains(text(),"Дальше")])', document, null, XPathResult.ANY_TYPE, null);
    const nBtnlink = document.querySelector('a.a4q7');
    const nextPageBtn1 = nBtnlink.nextElementSibling;
    if (!nextPageBtn && !nextPageBtn1) {
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
    country: 'RU',
    store: 'ozon',
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
    domain: 'ozon.ru',
    zipcode: '',
  },
  implementation,
};
