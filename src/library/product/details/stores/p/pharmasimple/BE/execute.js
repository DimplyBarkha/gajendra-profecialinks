
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'pharmasimple',
    domain: 'pharmasimple.com',
    loadedSelector: 'div[class="primary_block row"], div[class="pagenotfound"], div[class="alert alert-danger"], ul[class="product_list grid row"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
