
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CZ',
    store: 'fany',
    domain: 'fany.cz',
    url: 'https://www.fanymarket.cz/vyhledavani/?search={searchTerms}',
    loadedSelector: 'main.main-jscart',
    noResultsXPath: '//div[@class="alert alert-info"]',
    zipcode: '',
  },
};
