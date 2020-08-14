
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'sephora',
    domain: 'sephora.com.au',
    url: 'https://www.sephora.com.au/search?q={searchTerms}&view=60',
    loadedSelector: 'div.products-grid',
    // noResultsXPath: '//h4[contains(., "no products found")]',
    zipcode: '',
  },
};
