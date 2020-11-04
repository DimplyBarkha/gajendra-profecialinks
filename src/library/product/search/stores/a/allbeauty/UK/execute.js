
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'allbeauty',
    domain: 'allbeauty.com',
    url: 'https://www.allbeauty.com/gb/en/search/?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
