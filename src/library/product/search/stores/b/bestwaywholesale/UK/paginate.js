
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'bestwaywholesale',
    nextLinkSelector: 'ul > li.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'p.prodprice',
    noResultsXPath: '//div[contains(@class,"no-search-results")]',
    openSearchDefinition: null,
    domain: 'bestwaywholesale.co.uk',
    zipcode: '',
  },
};
