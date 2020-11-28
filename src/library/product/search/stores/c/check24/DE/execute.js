
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'check24',
    domain: 'check24.de',
    url: 'https://shopping.check24.de/suche.html?query={searchTerms}',
    loadedSelector: 'div.srp-row.products-grid div.grid-product',
    noResultsXPath: '//div[@class="fakeresult_headline"]//font//font',
    zipcode: '',
  },
};