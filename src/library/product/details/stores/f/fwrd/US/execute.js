
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'fwrd',
    domain: 'fwrd.com',
    loadedSelector: 'div.fwd_pdp div.pdp__col--fixed-width .price__retail',
    noResultsXPath: null,
    zipcode: '',
  },
};
