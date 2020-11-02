
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'appie',
    nextLinkSelector: '#start-of-content > div.f-load-more > button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[contains(@data-testhook,"search-no-results")]',
    domain: 'appie.nl',
    zipcode: '',
  },
};
