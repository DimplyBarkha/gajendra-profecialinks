
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'nordstrom',
    domain: 'nordstrom.com',
    url: 'https://www.nordstrom.ca/sr?origin=keywordsearch&keyword={searchTerms}',
    loadedSelector: 'a#product-results-query-anchor',
    noResultsXPath: '//h1[contains(text(),"No results for")] | //span[contains(text(),"Check the spelling or try a more general term.")]',
  },
};
