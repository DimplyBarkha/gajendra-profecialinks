module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'sportsdirect',
    domain: 'sportsdirect.com',
    url: 'https://www.sportsdirect.com/searchresults?DescriptionFilter={searchTerms}',
    loadedSelector: 'div[class*="productimage"] a>div>img',
    noResultsXPath: '//div[@class="nosearch-para"]',
    zipcode: '',
  },
};
