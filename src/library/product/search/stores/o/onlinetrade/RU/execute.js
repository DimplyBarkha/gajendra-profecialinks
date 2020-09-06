
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'onlinetrade',
    domain: 'onlinetrade.ru',
    url: 'https://www.onlinetrade.ru/sitesearch.html?query={searchTerms}',
    loadedSelector: 'div.goods__items minilisting searchlisting',
    noResultsXPath: '//div[@class="note note__pink"]/@xpath',
    zipcode: '',
  },
};
