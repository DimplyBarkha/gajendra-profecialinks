
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'ocado',
    domain: 'ocado.uk',
    loadedSelector: 'div#main-content',
    noResultsXPath: '//div[@class="nf-resourceNotFound"]',
    zipcode: "''",
  },
};
