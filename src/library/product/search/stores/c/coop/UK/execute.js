
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'coop',
    domain: 'coop.co.uk',
    url: 'https://www.coop.co.uk/products/search?query={searchTerms}',
    loadedSelector: 'div.ais-results article',
    noResultsXPath: '//h2[contains(text(),"Sorry we could not find what you were searching for")]',
    zipcode: "''",
  },
};
