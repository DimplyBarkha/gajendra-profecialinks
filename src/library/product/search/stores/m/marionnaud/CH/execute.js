
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'marionnaud',
    domain: 'marionnaud.ch',
    url: 'https://www.marionnaud.ch/de/search?text={searchTerms}',
    loadedSelector: 'div.more-data-loader div.product-tile img.product-tile__image',
    noResultsXPath: '//section[contains(@data-position, "emptySearchResult")]',
    zipcode: '',
  },
};
