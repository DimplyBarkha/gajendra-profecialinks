
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    domain: 'flaconi.de',
    url: 'https://www.flaconi.de/search/?q={searchTerms}',
    loadedSelector: 'div.category-products > ul > li:not([class="no-hover"])',
    noResultsXPath: '//div[@class="search-noresult"]/span[1][contains(.,"Please try again!")]',
  },
};
