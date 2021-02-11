
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'sportsdirect',
    nextLinkSelector: 'a.NextLink',
    loadedSelector: 'div[class*="productimage"] a>div>img',
    noResultsXPath: '//div[@class="nosearch-para"]',
    domain: 'sportsdirect.com',
  },
};
