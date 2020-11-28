
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ZA',
    store: 'pnp',
    domain: 'pnp.co.za',
    url: 'https://www.pnp.co.za/pnpstorefront/pnp/en/search/?text={searchTerms}',
    loadedSelector: 'ul.col-md-12.product-listing.product-grid.product-grid',
    noResultsXPath: '//h3[contains(text(), "Oh dear,")]',
    zipcode: '',
  },
};
