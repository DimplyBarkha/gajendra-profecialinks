
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'staples',
    nextLinkSelector: 'span.pager-arrow, .next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#ResultsSection',
    noResultsXPath: '//h1[@id="MainHdr"]',
    openSearchDefinition: null,
    domain: 'staples.se',
    zipcode: '',
  },
};
