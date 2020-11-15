
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    domain: 'plein.nl',
    url: 'https://www.plein.nl/zoeken?search={searchTerms}',
    loadedSelector: 'div.clear.product-grid-view',
    // noResultsXPath: null,
    zipcode: "''",
  },
};
