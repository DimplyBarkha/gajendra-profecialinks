
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'riverbendhome',
    domain: 'riverbendhome.com',
    loadedSelector: 'div.product-details-wrapper',
    noResultsXPath: '//section[@data-section-id="template-404"]',
    zipcode: "''",
  },
};
