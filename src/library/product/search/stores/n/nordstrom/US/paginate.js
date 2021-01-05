
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'nordstrom',
    nextLinkSelector: '._2gKYw>li[class*="_3wETL"]+li>a',
    loadedSelector: 'a#product-results-query-anchor',
    noResultsXPath: '//h1[contains(text(),"No results for")] | //span[contains(text(),"Check the spelling or try a more general term.")]',
    domain: 'nordstrom.com',
  },
};
