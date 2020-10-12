
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'insight',
    domain: 'insight.com',
    url: 'https://www.insight.com/en_US/search.html?qtype=all&q={searchTerms}',
    loadedSelector: 'div#columns medium-9 result-col js-search-load-result',
    noResultsXPath: '//div[contains(text(),"Sorry, no items were found. Please click on one of the other categories above, or try a different search.")]',
    zipcode: "''",
  },
};
