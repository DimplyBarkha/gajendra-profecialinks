
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'jdsports',
    domain: 'jdsports.co.uk',
    url: 'https://www.jdsports.co.uk/campaign/{searchTerms}/?facet-bag-type={searchTerms}&max=72',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
