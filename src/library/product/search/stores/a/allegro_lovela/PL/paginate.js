
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'allegro_lovela',
    nextLinkSelector: 'div > a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div > a[name="pagination-bottom"]',
    noResultsXPath: '//div/p[contains(@class, "mp0t_ji")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'allegro.pl',
    zipcode: '',
  },
};
