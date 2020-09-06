
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    nextLinkSelector: 'div.c-toolbar is-bottom a.is-nextLink',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.is-lazyLoadContainer',
    noResultsXPath: '//div[@class="c-card is-system is-noResults"]',
    openSearchDefinition: null,
    domain: 'mediaexpert.pl',
    zipcode: "''",
  },
};
