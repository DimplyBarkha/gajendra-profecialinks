
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'bilka',
    domain: 'bilka.dk',
    url: 'https://www.bilka.dk/search/?q={searchTerms}',
    loadedSelector: 'div.products',
    noResultsXPath: '//div[@class="no-results"]',
    zipcode: '',
  },
};
