
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'petsmart',
    nextLinkSelector: 'li.current-page + li',
    mutationSelector: null,
    spinnerSelector: 'div.loader',
    loadedSelector: 'ul#search-result-items li',
    noResultsXPath: '//p[contains(text(), "no results")]',
    openSearchDefinition: null,
    domain: 'petsmart.ca',
    zipcode: '',
  },
};
