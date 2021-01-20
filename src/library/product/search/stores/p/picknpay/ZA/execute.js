
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ZA',
    store: 'picknpay',
    domain: 'pnp.co.za',
    url: 'https://www.pnp.co.za/pnpstorefront/pnp/en/search/?text={searchTerms}',
    loadedSelector: 'div.col-xs-12.product-list-wrapper',
    noResultsXPath: '//div[@class="no-results"]',
    zipcode: '',
  },
};
