

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'voila',
    domain: 'voila.ca',
    url: 'https://voila.ca/products/search?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: `//span[contains(text(),"We couldn't find any products")]`,
    zipcode: '',
  },
};


