
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'total_wine_95825',
    domain: 'totalwine.com',
    url: 'https://www.totalwine.com/search/all?text={searchTerms}',
    loadedSelector: 'a[class="productImg__3fOOgAmO"] > picture > img',
    noResultsXPath: '//p[@class="resultsTitle__2yxTXNeW"]/span',
    zipcode: '95825',
  },
};
