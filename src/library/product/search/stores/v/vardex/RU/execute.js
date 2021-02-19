
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'vardex',
    domain: 'vardex.ru',
    url: 'https://www.vardex.ru/#/search/{searchTerms}',
    loadedSelector: 'div.l-content',
    noResultsXPath: '//div[@class="page404"]',
    zipcode: '',
  },
};
