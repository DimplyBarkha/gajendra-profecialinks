
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    domain: 'mediaexpert.pl',
    url: 'https://www.mediaexpert.pl/search?query[querystring]={searchTerms}',
    loadedSelector: 'div.is-lazyLoadContainer',
    noResultsXPath: '//div[@class="c-card is-system is-noResults"]',
    zipcode: "''",
  },
};
