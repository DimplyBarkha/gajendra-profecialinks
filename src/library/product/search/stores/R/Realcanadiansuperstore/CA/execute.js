
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'Realcanadiansuperstore',
    domain: 'realcanadiansuperstore.ca',
    url: 'https://www.realcanadiansuperstore.ca/search?search-bar={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
