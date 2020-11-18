
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'filshill',
    domain: 'filshill.co.uk',
    url: 'https://sales.filshill.co.uk/products/gridlistsearch.asp?product_desc={Keywords}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
