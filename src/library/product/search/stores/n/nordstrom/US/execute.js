
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'nordstrom',
    domain: 'nordstrom.com',
    url: 'https://www.nordstrom.com/sr?origin=keywordsearch&keyword={searchTerms}',
    loadedSelector: 'a#product-results-query-anchor',
    noResultsXPath: '//h1[contains(text(),"No results for")] | //span[contains(text(),"Check the spelling or try a more general term.")]',
  },
};
