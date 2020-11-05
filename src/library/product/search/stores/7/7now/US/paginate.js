
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: '7now',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.search__cardItems',
    noResultsXPath: '//h2[@class="search__noResults-content-title"]',
    openSearchDefinition: null,
    domain: '7now.com',
    zipcode: "''",
  },
};
