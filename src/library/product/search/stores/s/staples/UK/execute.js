
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'staples',
    domain: 'staples.co.uk',
    timeout: 90000,
    url: 'https://www.staples.co.uk/search?keywords={searchTerms}',
    // loadedSelector: 'div[id="ResultsSection"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
