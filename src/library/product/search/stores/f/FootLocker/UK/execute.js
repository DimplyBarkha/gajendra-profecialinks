
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'FootLocker',
    domain: 'footlocker.co.uk',
    url: 'https://www.footlocker.co.uk/en/search?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
