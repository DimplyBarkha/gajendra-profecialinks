module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'haar-shop',
    domain: 'haar-shop.ch',
    url: 'https://www.haar-shop.ch/en/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.products',
    noResultsXPath: "//div[@class='fl-no-results-suggestions fl-row fl-small-12 fl-medium-6 fl-columns']",
    zipcode: '',
  },
};
