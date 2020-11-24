
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'lenstore',
    domain: 'lenstore.co.uk',
    url: 'https://www.lenstore.co.uk/search/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
