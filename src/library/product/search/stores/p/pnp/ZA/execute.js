
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ZA',
    store: 'pnp',
    domain: 'pnp.co.za',
    url: 'https://www.pnp.co.za/pnpstorefront/pnp/en/search/?pageSize=72&q={searchTerms}%3Arelevance&show=Page#',
    loadedSelector: 'ul.col-md-12.product-listing.product-grid.product-grid',
    noResultsXPath: '//h3[contains(text(), "Oh dear,")]',
    zipcode: '',
  },
};
