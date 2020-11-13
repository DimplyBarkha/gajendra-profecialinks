
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'petshop',
    domain: 'petshop.ru',
    url: 'https://www.petshop.ru/search/?q={searchTerms}',
    loadedSelector: 'div#products-wrapper',
    noResultsXPath: '//div[@class="search-result-items"]//p[@class="errortext"]',
    zipcode: '',
  },
};
