
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    domain: 'mondoffice.com',
    url: 'https://www.mondoffice.com/search?x=0&y=0&keywords=paper',
    loadedSelector: '#ResultsSection',
    // noResultsXPath: null,
    zipcode: '',
  },
};
