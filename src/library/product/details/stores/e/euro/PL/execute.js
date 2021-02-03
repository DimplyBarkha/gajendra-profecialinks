
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    domain: 'euro.com.pl',
    loadedSelector: null,
    noResultsXPath: '//div[@id="empty-search"] | //div[@class="suggestion-try"]',
    zipcode: '',
  },
};
