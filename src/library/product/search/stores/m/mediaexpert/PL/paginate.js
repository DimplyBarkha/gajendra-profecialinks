
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    nextLinkSelector: 'span.is-next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.is-lazyLoadContainer',
    noResultsXPath: '//div[@class="c-card is-system is-noResults"]',
    openSearchDefinition: null,
    domain: 'mediaexpert.pl',
    zipcode: "''",
  },
};
