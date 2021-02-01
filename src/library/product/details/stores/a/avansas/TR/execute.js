
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'TR',
    store: 'avansas',
    domain: 'avansas.com',
    loadedSelector: 'div.product-list-area',
    noResultsXPath: '//h2/strong/following-sibling::text()',
    zipcode: "''",
  },
};
