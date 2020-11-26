
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'tractorsupplyco',
    domain: 'tractorsupply.com',
    url: 'https://www.tractorsupply.com/tsc/search/tshirt?searchTerm={id}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
