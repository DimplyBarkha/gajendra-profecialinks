
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'romeos',
    nextLinkSelector: 'a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="TalkerGrid__Item"]',
    noResultsXPath: '//div[@class="search-results__empty-message"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'martinplace.romeosonline.com.au',
    zipcode: '',
  },
};
