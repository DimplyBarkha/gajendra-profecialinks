
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'eapteka',
    domain: 'eapteka.ru',
    url: 'https://www.eapteka.ru/search/?q={searchTerms}&utm_referrer=',
    loadedSelector: 'div.sec-categories__list.sec-search__list.ajax-container',
    noResultsXPath: '//div[@class="container"]//h1[contains(.,"По запросу")]',
    zipcode: '',
  },
};
