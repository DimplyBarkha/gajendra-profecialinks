
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'plus',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img[class="lazy"]',
    noResultsXPath: '//div[@class="ish-search-noResults-block"]//div//p',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'plus.nl',
    zipcode: '',
  },
};
