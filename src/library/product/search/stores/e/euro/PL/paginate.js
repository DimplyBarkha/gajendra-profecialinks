
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    nextLinkSelector: 'div.paging-numbers > a.paging-number.js-btn-paging',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#products',
    noResultsXPath: '//div[@id="empty-search"]',
    openSearchDefinition: null,
    domain: 'euro.com.pl',
    zipcode: '',
  },
};
