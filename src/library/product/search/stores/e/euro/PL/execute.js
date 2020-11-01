
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    domain: 'euro.com.pl',
    url: 'https://www.euro.com.pl/search.bhtml?keyword={searchTerms}',
    loadedSelector: 'div#products',
    noResultsXPath: '//div[@id="empty-search"]',
    zipcode: '',
  },
};
