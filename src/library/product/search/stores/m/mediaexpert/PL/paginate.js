
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    nextLinkSelector: 'div[class*="bottom"] span[class*="is-next"] >a>span',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'h2[data-zone*="OFFERBOX_NAME"]',
    noResultsXPath: '//div[contains(@class,"noResults")]//p[1]',
    openSearchDefinition: null,
    zipcode: '',
    domain: 'mediaexpert.pl',
  },
};
