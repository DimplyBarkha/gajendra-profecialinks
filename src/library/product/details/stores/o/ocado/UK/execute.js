
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'ocado',
    domain: 'ocado.com',
    loadedSelector: 'div#main-content',
    noResultsXPath: '//div[@class="nf-resourceNotFound"]',
    zipcode: "''",
  },
};
