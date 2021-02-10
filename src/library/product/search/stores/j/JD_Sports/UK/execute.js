
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'JD_Sports',
    domain: 'jdsports.co.uk',
    url: 'https://www.jdsports.co.uk/search/{searchTerms}/?max=150',
    loadedSelector:'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
