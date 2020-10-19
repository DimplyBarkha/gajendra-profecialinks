
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'telus',
    domain: 'telus.com',
    loadedSelector: 'div.product-detail',
    noResultsXPath: "//ul[@data-id='brand-filter__list']",
    zipcode: '',
  },
};
