
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    // nextLinkSelector: 'div.pager.plp-paginator__pager.pager--mobile-bottom > div > e2-plp-page-selectors[css-modifier="pager__link pager__link--next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'kruidvat.nl',
    zipcode: '',
  },
};
