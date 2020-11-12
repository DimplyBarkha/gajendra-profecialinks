
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'officemag',
    domain: 'officemag.ru',
    url: 'https://www.officemag.ru/search/?q={searchTerms}',
    loadedSelector: 'div.listItemsContainer',
    noResultsXPath: '//div[@class="searchPageForm"]',
    zipcode: '',
  },
};
