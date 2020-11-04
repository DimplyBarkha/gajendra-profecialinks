
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'boozt',
    domain: 'boozt.com',
    url: 'https://www.boozt.com/eu/en/search?search_key={searchTerms}',
    loadedSelector: 'div[class="product-list clearfix"]',
    noResultsXPath: '//h2[@class="fsearchnoresults__header"]',
    zipcode: '',
  },
};
